import IORedis from 'ioredis';

import { env } from '@/common/utils';

export const redis = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: env.REDIS_DB,
  maxRetriesPerRequest: null,
});
