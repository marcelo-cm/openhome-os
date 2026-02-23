import { personalItemDetails } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const PersonalItemDetailSchema = createSelectSchema(personalItemDetails);
export const CreatePersonalItemDetailSchema =
  createInsertSchema(personalItemDetails);
export const UpdatePersonalItemDetailSchema = createInsertSchema(
  personalItemDetails,
)
  .partial()
  .required({ item_id: true });
