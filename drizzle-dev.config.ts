import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.development' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
  out: './drizzle',
  schema: ['./db/db-schema.ts', './db/enums.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
