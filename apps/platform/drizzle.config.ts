import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
  out: '../../packages/core/src/drizzle',
  schema: [
    '../../packages/core/src/db/db-schema.ts',
    '../../packages/core/src/db/enums.ts',
  ],
  dialect: 'postgresql',
  schemaFilter: ['public'],
  extensionsFilters: ['postgis'],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
