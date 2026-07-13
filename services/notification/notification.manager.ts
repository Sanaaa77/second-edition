import { getSupabaseClient } from "@/lib/supabase/utils";
import { domainEventBus } from "@/lib/core/events/EventBus";

export interface NotificationPayload {
  profile_id: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export const NotificationManager = {
  async notify(payload: NotificationPayload): Promise<void> {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase.from('notifications').insert([
      {
        ...payload,
        read: false,
        created_at: new Date().toISOString(),
      }
    ]);

    if (error) {
      console.error('[NotificationManager] Failed to create notification:', error.message);
      return;
    }

    // Publish event for real-time updates or external delivery (SMS/Email)
    await domainEventBus.publish({
      type: 'NotificationCreated',
      payload,
      metadata: {
        timestamp: new Date().toISOString(),
        correlationId: (payload.metadata?.correlationId as string) || 'system',
      }
    });
  }
};
