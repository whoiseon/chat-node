import { Queue } from 'bullmq';

import { redis } from '@/common/cache';

export const messageQueue = new Queue('messages', { connection: redis });
