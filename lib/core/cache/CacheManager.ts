import { Logger } from "@/lib/core/logging/Logger";

interface CacheEntry<T> {
  data: T;
  expiry: number;
  tags?: string[];
}

export class CacheManager {
  private static instance: CacheManager;
  private storage: Map<string, CacheEntry<any>> = new Map();
  private DEFAULT_TTL = 1000 * 60 * 5;

  private constructor() {}

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public set<T>(key: string, data: T, options: { ttl?: number; tags?: string[] } = {}): void {
    const ttl = options.ttl || this.DEFAULT_TTL;
    const expiry = Date.now() + ttl;
    this.storage.set(key, { data, expiry, tags: options.tags });
    Logger.info(`[Cache] Set: ${key} (TTL: ${ttl}ms, Tags: ${options.tags?.join(',') || 'none'})`);
  }

  public get<T>(key: string): T | null {
    const entry = this.storage.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.storage.delete(key);
      return null;
    }
    return entry.data as T;
  }

  public async remember<T>(key: string, operation: () => Promise<T>, options: { ttl?: number; tags?: string[] } = {}): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const fresh = await operation();
    this.set(key, fresh, options);
    return fresh;
  }

  public invalidate(key: string): void {
    this.storage.delete(key);
  }

  public invalidatePattern(pattern: string): void {
    for (const key of Array.from(this.storage.keys())) {
      if (key.includes(pattern)) {
        this.storage.delete(key);
      }
    }
  }

  public invalidateTags(tags: string[]): void {
    for (const [key, entry] of Array.from(this.storage.entries())) {
      if (entry.tags && tags.some(t => entry.tags!.includes(t))) {
        this.storage.delete(key);
      }
    }
  }

  public clear(): void {
    this.storage.clear();
  }
}

export const cacheManager = CacheManager.getInstance();
