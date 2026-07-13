import { Task } from "@/types/database";
import { BaseService } from "../BaseService";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/core/errors/AppErrors";
import { domainEventBus } from "@/lib/core/events/EventBus";
import { cacheManager } from "@/lib/core/cache/CacheManager";

export class TaskService extends BaseService {
  async getMyTasks(): Promise<Task[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return this.execute(
      async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: true });
          
        if (error) throw new RepositoryError(error.message);
        return (data || []) as Task[];
      },
      {
        name: 'TaskService.getMyTasks',
        cacheKey: `tasks_${user.id}`
      }
    );
  }

  async complete(taskId: string): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    await this.execute(
      async () => {
        const { error } = await supabase
          .from('tasks')
          .update({ status: 'completed' })
          .eq('id', taskId);
          
        if (error) throw new RepositoryError(error.message);

        if (user) {
          cacheManager.invalidatePattern(`tasks_${user.id}`);
        }

        // Publish Event
        await domainEventBus.publish({
          type: 'TaskCompleted',
          payload: { taskId, profileId: user?.id },
          metadata: {
            timestamp: new Date().toISOString(),
            correlationId: crypto.randomUUID()
          }
        });
      },
      { name: `TaskService.complete(${taskId})` }
    );
  }
}
