import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { AppDatabase, DB_TOKEN, messageTable } from '@/database';

export interface SaveMessageJob {
  id: string;
  channelId: string;
  userId: string | null;
  type: 'message' | 'system' | 'notice';
  content: string;
}

@Processor('messages')
export class MessageProcessor extends WorkerHost {
  private readonly logger = new Logger(MessageProcessor.name);

  constructor(@Inject(DB_TOKEN) private readonly db: AppDatabase) {
    super();
  }

  async process(job: Job<SaveMessageJob>) {
    const { id, channelId, userId, type, content } = job.data;

    await this.db.insert(messageTable).values({
      id,
      channelId,
      userId,
      type,
      content,
    });

    this.logger.log(
      `Message saved: channel=${channelId} user=${userId}`,
    );
  }
}
