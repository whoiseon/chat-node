import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard } from '@nestjs/throttler';

import { CacheModule } from '@/common/cache';
import { ApiExceptionFilter } from '@/common/filters';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ThrottleModule } from '@/common/modules';
import { Env, validateEnv } from '@/common/utils';
import { DatabaseModule } from '@/database';

import { AuthModule } from './features/auth/auth.module';
import { ChannelsModule } from './features/channels/channels.module';
import { HealthModule } from './features/health/health.module';
import { MessagesModule } from './features/messages/messages.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
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
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        connection: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          password: config.get('REDIS_PASSWORD') || undefined,
          db: config.get('REDIS_DB'),
        },
      }),
    }),
    ThrottleModule,
    DatabaseModule,
    CacheModule,
    AuthModule,
    HealthModule,
    ChannelsModule,
    MessagesModule,
  ],
})
export class AppModule {}
