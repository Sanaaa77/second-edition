import { BaseError, RepositoryError } from "@/lib/core/errors/AppErrors";
import { Logger } from "@/lib/core/logging/Logger";
import { cacheManager } from "@/lib/core/cache/CacheManager";

/**
 * BaseService - Standardized behavior for all platform services.
 */
export abstract class BaseService {
  protected async execute<T>(
    operation: () => Promise<T>,
    context: { 
      name: string; 
      cacheKey?: string; 
      cacheTTL?: number;
    }
  ): Promise<T> {
    const { name, cacheKey, cacheTTL } = context;

    if (cacheKey) {
      const cached = cacheManager.get<T>(cacheKey);
      if (cached !== null) return cached;
    }

    try {
      const start = performance.now();
      const result = await operation();
      const end = performance.now();
      Logger.info(`[Service] ${name} completed in ${(end - start).toFixed(2)}ms`);

      if (cacheKey) {
        cacheManager.set(cacheKey, result, { ttl: cacheTTL });
      }

      return result;
    } catch (error) {
      Logger.error(`[Service] ${name} failed`, error);
      if (error instanceof BaseError) throw error;
      throw new RepositoryError(`${name} failed: ${(error as Error).message}`);
    }
  }
}
