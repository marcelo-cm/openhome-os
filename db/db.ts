'sever-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/db/db-schema';
import * as relations from '@/db/relations';

const DATABASE_URL = process.env.DATABASE_URL!;
const client = postgres(DATABASE_URL);

export const db = drizzle(client, {
  schema: { ...schema, ...relations },
});
