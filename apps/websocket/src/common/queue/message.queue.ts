import { Queue } from 'bullmq';
import IORedis from 'ioredis';

import { env } from '@/common/utils';

const connection = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  db: 0,
  maxRetriesPerRequest: null,
});

export const messageQueue = new Queue('messages', { connection });
