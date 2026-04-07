import { Module, OnModuleInit } from '@nestjs/common';

import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule implements OnModuleInit {
  constructor(private readonly channelsService: ChannelsService) {}

  async onModuleInit() {
    await this.channelsService.syncMemberCountsToCache();
  }
}
