import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { ApiExceptionFilter } from '@/common/filters';
import { ThrottleModule } from '@/common/modules';
import { validateEnv } from '@/common/utils';
import { DatabaseModule } from '@/database';

import { AuthModule } from './features/auth/auth.module';
import { HealthModule } from './features/health/health.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ThrottleModule,
    DatabaseModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
