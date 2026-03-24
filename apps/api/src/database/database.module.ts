import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Env } from '@/common/utils';

import { createDrizzleClient, DB_TOKEN } from './database.client';

@Global()
@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: DB_TOKEN,
      useFactory: (configService: ConfigService<Env>) => {
        const url = configService.get('DATABASE_URL', { infer: true })!;
        const isDev =
          configService.get('NODE_ENV', { infer: true }) === 'development';
        return createDrizzleClient(url, isDev);
      },
    },
  ],
  exports: [DB_TOKEN],
})
export class DatabaseModule {}
