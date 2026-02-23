import { items } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const ItemSchema = createSelectSchema(items);
export const CreateItemSchema = createInsertSchema(items);
export const UpdateItemSchema = createInsertSchema(items)
  .partial()
  .required({ id: true });
