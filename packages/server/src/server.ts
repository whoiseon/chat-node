import Koa from 'koa';

import bootstrap from './bootstrap';
import { db } from './database';
import './env';

const { PORT } = process.env;

if (!PORT) {
  throw new Error('Required environment variable are not set');
}

async function server(): Promise<void> {
  try {
    console.log('🚀 Starting server...');

    // 데이터베이스 연결
    await db.connect();

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
      await db.disconnect();
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

server().catch((err) => {
  console.error('❌ Unhandled error:', err);
  process.exit(1);
});
