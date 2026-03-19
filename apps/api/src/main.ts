import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { winstonLogger } from '@/common/configs';

import { AppModule } from './app.module';
import { bootstrap } from './bootstrap';

const main = async (): Promise<void> => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true, logger: winstonLogger },
  );

  await bootstrap(app);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
