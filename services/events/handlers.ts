import { domainEventBus, DomainEvent } from "@/lib/core/events/EventBus";
import { NotificationManager } from "@/services/notification/notification.manager";
import { Logger } from "@/lib/core/logging/Logger";
import { cacheManager } from "@/lib/core/cache/CacheManager";

export function initDomainEventHandlers() {
  Logger.info("Initializing Domain Event Handlers...");

  domainEventBus.subscribe('ApplicationStatusChanged', async (event: DomainEvent<any>) => {
    const { applicationId, newStatus, profileId } = event.payload;

    cacheManager.invalidatePattern(`application_${applicationId}`);
    cacheManager.invalidatePattern(`applications_${profileId}`);

    await NotificationManager.notify({
      profile_id: profileId,
      title: "بروزرسانی وضعیت اپلیکیشن",
      message: `وضعیت درخواست شما به "${newStatus}" تغییر یافت.`,
      type: "Application",
      metadata: { applicationId, correlationId: event.metadata.correlationId }
    });
  });

  domainEventBus.subscribe('DocumentUploaded', async (event: DomainEvent<any>) => {
    const { profileId, documentType } = event.payload;
    cacheManager.invalidatePattern(`documents_${profileId}`);
    await NotificationManager.notify({
      profile_id: profileId,
      title: "مدارک آپلود شد",
      message: `مدرک ${documentType} شما بارگذاری شد.`,
      type: "Document"
    });
  });

  domainEventBus.subscribe('TaskCompleted', async (event: DomainEvent<any>) => {
    const { profileId } = event.payload;
    cacheManager.invalidatePattern(`tasks_${profileId}`);
  });

  domainEventBus.subscribe('ProfileUpdated', async (event: DomainEvent<any>) => {
    const { profileId } = event.payload;
    cacheManager.invalidatePattern(`decision_report_${profileId}`);
    Logger.info(`Invalidated decision report for profile: ${profileId}`);
  });

  domainEventBus.subscribe('LessonCompleted', async (event: DomainEvent<any>) => {
    const { profileId } = event.payload;
    // Invalidate decision report as language score might have changed
    cacheManager.invalidatePattern(`decision_report_${profileId}`);
    cacheManager.invalidatePattern(`academy_dashboard_${profileId}`);
    Logger.info(`Lesson completed event processed for: ${profileId}`);
  });
}
