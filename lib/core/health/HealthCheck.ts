import { getSupabaseClient } from '@/lib/supabase/utils';
import { cacheManager } from '../cache/CacheManager';
import { domainEventBus } from '../events/EventBus';

export interface HealthReport {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  checks: {
    database: boolean;
    storage: boolean;
    auth: boolean;
    cache: boolean;
    eventBus: boolean;
  };
}

class HealthCheckManager {
  public async getReport(): Promise<HealthReport> {
    const supabase = getSupabaseClient();
    
    const [dbCheck, storageCheck, authCheck] = await Promise.all([
      this.checkDatabase(supabase),
      this.checkStorage(supabase),
      this.checkAuth(supabase)
    ]);

    const cacheCheck = !!cacheManager;
    const eventBusCheck = !!domainEventBus;

    const allHealthy = dbCheck && storageCheck && authCheck && cacheCheck && eventBusCheck;

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck,
        storage: storageCheck,
        auth: authCheck,
        cache: cacheCheck,
        eventBus: eventBusCheck
      }
    };
  }

  private async checkDatabase(supabase: any): Promise<boolean> {
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  private async checkStorage(supabase: any): Promise<boolean> {
    try {
      const { error } = await supabase.storage.listBuckets();
      return !error;
    } catch {
      return false;
    }
  }

  private async checkAuth(supabase: any): Promise<boolean> {
    try {
      const { error } = await supabase.auth.getSession();
      return !error;
    } catch {
      return false;
    }
  }
}

export const healthCheck = new HealthCheckManager();
