'sever-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './db-schema';
import * as relations from './relations';

const DATABASE_URL = process.env.DATABASE_URL!;
const client = postgres(DATABASE_URL);

export const db = drizzle(client, {
  schema: { ...schema, ...relations },
});

export type Database = Parameters<Parameters<typeof db.transaction>[0]>[0];
