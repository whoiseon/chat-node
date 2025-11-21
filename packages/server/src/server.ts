import Koa from 'koa';

import bootstrap from './bootstrap';
import './env';
import { prisma } from './database';

const { PORT } = process.env;

if (!PORT) {
  throw new Error('Required environment variable are not set');
}

async function server(): Promise<void> {
  try {
    console.log('🚀 Starting server...');

    // Graceful shutdown 설정
    setupGracefulShutdown();

    const app = new Koa();

    // TODO: database connection check before starting the server
    await bootstrap(app, PORT ?? '3065');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

function setupGracefulShutdown(): void {
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

    try {
      console.log('✅ Server shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGUSR2', () => shutdown('SIGUSR2')); // nodemon restart
}

server()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('❌ Unhandled error:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
