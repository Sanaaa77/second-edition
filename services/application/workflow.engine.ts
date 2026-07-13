import { ApplicationRepository, ApplicationHistoryRepository } from "@/lib/repositories";
import { ApplicationStatus } from "@/types/database";
import { domainEventBus } from "@/lib/core/events/EventBus";
import { WorkflowError, AuthorizationError, ValidationError } from "@/lib/core/errors/AppErrors";
import { createClient } from "@/lib/supabase/client";
import { cacheManager } from "@/lib/core/cache/CacheManager";
import { TransactionManager } from "@/lib/core/transactions/TransactionManager";
import { AuditService } from "@/services/audit/audit.service";

const WORKFLOW_CONFIG: Record<string, { next: ApplicationStatus[], requiredDocs: string[] }> = {
  'Draft': { next: ['Preparing'], requiredDocs: [] },
  'Preparing': { next: ['Ready', 'Draft'], requiredDocs: ['Passport'] },
  'Ready': { next: ['Submitted', 'Preparing'], requiredDocs: ['Passport', 'Transcript', 'Diploma'] },
  'Submitted': { next: ['Review'], requiredDocs: [] },
  'Review': { next: ['Interview', 'Accepted', 'Rejected'], requiredDocs: [] },
  'Interview': { next: ['Accepted', 'Rejected'], requiredDocs: [] },
  'Accepted': { next: ['Visa'], requiredDocs: [] },
  'Rejected': { next: ['Draft'], requiredDocs: [] },
  'Visa': { next: ['Completed'], requiredDocs: ['Visa_Document'] },
  'Completed': { next: [], requiredDocs: [] }
};

export const WorkflowEngine = {
  async transition(applicationId: string, nextStatus: ApplicationStatus, reason?: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AuthorizationError("User must be authenticated");

    const appRepo = new ApplicationRepository();
    const { data: app, error: appError } = await appRepo.findById(applicationId);
    if (appError || !app) throw new ValidationError("Application not found");

    const currentStatus = String(app.status);
    const config = WORKFLOW_CONFIG[currentStatus];

    if (!config?.next.includes(nextStatus)) {
      throw new WorkflowError(`Invalid state transition: ${currentStatus} -> ${nextStatus}`);
    }

    const correlationId = crypto.randomUUID();

    return await TransactionManager.run(async () => {
      await appRepo.updateStatus(applicationId, nextStatus, reason);
      
      const { ApplicationHistoryRepository } = await import("@/lib/repositories");
      await ApplicationHistoryRepository.logAction({
        application_id: applicationId,
        changed_by: user.id,
        previous_status: currentStatus as any,
        new_status: nextStatus,
        action_type: 'STATUS_CHANGE',
        reason: reason || "Automated state transition"
      });

      cacheManager.invalidatePattern(`application_${applicationId}`);
      cacheManager.invalidatePattern(`applications_${user.id}`);

      await domainEventBus.publish({
        type: 'ApplicationStatusChanged',
        payload: { applicationId, previousStatus: currentStatus, newStatus: nextStatus, profileId: app.profile_id },
        metadata: { timestamp: new Date().toISOString(), actorId: user.id, correlationId }
      });

      return { success: true, correlationId };
    });
  }
};
