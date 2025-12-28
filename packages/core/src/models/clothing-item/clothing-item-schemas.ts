import { clothingItems } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ClothingItemSchema = createSelectSchema(clothingItems).extend({
  ai_metadata: z.unknown().nullable(),
});
export const CreateClothingItemSchema = createInsertSchema(clothingItems);
export const UpdateClothingItemSchema = createInsertSchema(clothingItems);
