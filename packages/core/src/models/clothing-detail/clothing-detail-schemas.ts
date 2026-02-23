import { clothingDetails } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const ClothingDetailSchema = createSelectSchema(clothingDetails);
export const CreateClothingDetailSchema = createInsertSchema(clothingDetails);
export const UpdateClothingDetailSchema = createInsertSchema(clothingDetails)
  .partial()
  .required({ item_id: true });
