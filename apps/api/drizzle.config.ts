import { Config, defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

const envFile =
  process.env.NODE_ENV === 'development' ? '.env.development' : '.env';

dotenv.config({
  path: path.resolve(__dirname, envFile),
});

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}) satisfies Config;
