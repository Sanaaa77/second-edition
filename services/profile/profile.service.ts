import { Profile } from "@/types/database";
import { BaseService } from "../BaseService";
import { createClient } from "@/lib/supabase/client";
import { cacheManager } from "@/lib/core/cache/CacheManager";
import { ProfileRepository } from "@/lib/repositories";
import { RepositoryError, AuthorizationError } from "@/lib/core/errors/AppErrors";
import { EventBus } from "@/lib/core/events/EventBus";

export class ProfileService extends BaseService {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly eventBus?: EventBus
  ) {
    super();
  }

  async getOwnProfile(): Promise<Profile | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return this.execute(
      async () => {
        const { data, error } = await this.profileRepo.getById(user.id);
        if (error) throw new RepositoryError(error.message);
        return data as Profile;
      },
      {
        name: 'ProfileService.getOwnProfile',
        cacheKey: `profile_${user.id}`
      }
    );
  }

  async updateProfile(updates: Partial<Profile>): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AuthorizationError("Unauthorized");

    await this.execute(
      async () => {
        const { error } = await this.profileRepo.update(user.id, updates);
        if (error) throw new RepositoryError(error.message);
        
        cacheManager.invalidatePattern(`profile_${user.id}`);
        
        if (this.eventBus) {
          this.eventBus.publish({
            type: 'ProfileUpdated',
            payload: { profileId: user.id, updates },
            metadata: { 
              correlationId: crypto.randomUUID(), 
              timestamp: new Date().toISOString(),
              actorId: user.id 
            }
          });
        }
      },
      { name: 'ProfileService.updateProfile' }
    );
  }
}
