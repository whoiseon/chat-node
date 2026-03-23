import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

export const DB_TOKEN = 'DATABASE';

export function createDrizzleClient(url: string, logger?: boolean) {
  const client = postgres(url, {
    prepare: false,
  });
  return drizzle({ client, logger });
}

export type AppDatabase = ReturnType<typeof createDrizzleClient>;
