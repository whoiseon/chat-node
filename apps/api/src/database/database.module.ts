import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { Env } from '@/common/utils';

@Global()
@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'DATABASE',
      useFactory: (configService: ConfigService<Env>) => {
        drizzle({
          connection: {
            connectionString: configService.get('DATABASE_URL'),
          },
        });
      },
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
