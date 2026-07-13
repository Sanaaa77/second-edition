import { ApplicationRepository } from "@/lib/repositories";
import { ApplicationStatus } from "@/types/database";

// STATE MACHINE DEFINITION
const VALID_TRANSITIONS: Record<string, ApplicationStatus[]> = {
  'Draft': ['Preparing'],
  'Preparing': ['Ready', 'Draft'],
  'Ready': ['Submitted', 'Preparing'],
  'Submitted': ['Review'],
  'Review': ['Interview', 'Accepted', 'Rejected'],
  'Interview': ['Accepted', 'Rejected'],
  'Accepted': ['Visa'],
  'Rejected': ['Draft'],
  'Visa': ['Completed'],
  'Completed': []
};

export const ApplicationWorkflowService = {
  async transition(applicationId: string, nextStatus: ApplicationStatus, note?: string) {
    const appRepo = new ApplicationRepository();
    const app = await appRepo.findById(applicationId);
    if (!app) throw new Error("Application not found");

    const currentStatus = String(app.status);
    
    // Validate Transition
    if (!VALID_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
      throw new Error(`Illegal state transition: ${currentStatus} -> ${nextStatus}`);
    }

    await appRepo.updateStatus(applicationId, nextStatus, note);
    
    // MISSION ENGINE INTEGRATION (Simulated)
    await this.processMissions(nextStatus);

    return { success: true };
  },

  async processMissions(status: ApplicationStatus) {
    // In a real prod env, this would call a mission service to grant XP
    Logger.info(`Processing missions for status: ${status}`);
  }
};
