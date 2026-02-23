import { itemImages } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const ItemImageSchema = createSelectSchema(itemImages);
export const CreateItemImageSchema = createInsertSchema(itemImages);
export const UpdateItemImageSchema = createInsertSchema(itemImages)
  .partial()
  .required({ id: true });
