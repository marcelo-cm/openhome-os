import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { clothingItems } from '@/db/db-schema';

export const ClothingItemSchema = createSelectSchema(clothingItems).extend({
  ai_metadata: z.unknown().nullable(),
});
export const CreateClothingItemSchema = createInsertSchema(clothingItems);
export const UpdateClothingItemSchema = createInsertSchema(clothingItems);
