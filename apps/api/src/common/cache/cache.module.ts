import { Global, Inject, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Env } from '@/common/utils';

import { AppCache, CACHE_TOKEN, createRedisClient } from './cache.client';

@Global()
@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: CACHE_TOKEN,
      useFactory: (configService: ConfigService<Env>) => {
        const client = createRedisClient({
          host: configService.get('REDIS_HOST', { infer: true })!,
          port: configService.get('REDIS_PORT', { infer: true })!,
          password: configService.get('REDIS_PASSWORD', { infer: true }),
          db: configService.get('REDIS_DB', { infer: true }),
        });

        const logger = new Logger('CacheModule');

        client.on('connect', () => logger.log('Redis connected'));
        client.on('error', (err) => logger.error('Redis error', err));

        return client;
      },
    },
  ],
  exports: [CACHE_TOKEN],
})
export class CacheModule implements OnModuleDestroy {
  constructor(@Inject(CACHE_TOKEN) private readonly redis: AppCache) {}

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
