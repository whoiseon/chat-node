import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { MessageProcessor } from './messages.processor';
import { MessagesService } from './messages.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'messages' })],
  controllers: [MessagesController],
  providers: [MessagesService, MessageProcessor],
})
export class MessagesModule {}
