import Redis from 'ioredis';

export const CACHE_TOKEN = 'CACHE';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export function createRedisClient(config: CacheConfig): Redis {
  return new Redis({
    host: config.host,
    port: config.port,
    password: config.password || undefined,
    db: config.db ?? 0,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      return Math.min(times * 200, 2000);
    },
  });
}

export type AppCache = Redis;
