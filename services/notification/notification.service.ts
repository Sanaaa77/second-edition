import { Notification } from "@/types/database";
import { BaseService } from "../BaseService";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/core/errors/AppErrors";
import { NotificationManager } from "./notification.manager";

export class NotificationService extends BaseService {
  async getMyNotifications(): Promise<Notification[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return this.execute(
      async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw new RepositoryError(error.message);
        return (data || []) as Notification[];
      },
      {
        name: 'NotificationService.getMyNotifications',
        cacheKey: `notifications_${user.id}`,
        cacheTTL: 1000 * 30
      }
    );
  }

  async markAsRead(id: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await this.execute(
      async () => {
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);
        if (error) throw new RepositoryError(error.message);

        if (user) {
          const { cacheManager } = await import("@/lib/core/cache/CacheManager");
          cacheManager.invalidatePattern(`notifications_${user.id}`);
        }
      },
      { name: `NotificationService.markAsRead(${id})` }
    );
  }

  async notify(payload: any) {
    return await NotificationManager.notify(payload);
  }
}
