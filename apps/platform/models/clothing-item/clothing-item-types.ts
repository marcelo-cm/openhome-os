import { z } from 'zod';

import {
  ClothingItemSchema,
  CreateClothingItemSchema,
  UpdateClothingItemSchema,
} from '@/models/clothing-item/clothing-item-schemas';

export type TClothingItem = z.infer<typeof ClothingItemSchema>;
export type TCreateClothingItem = z.infer<typeof CreateClothingItemSchema>;
export type TUpdateClothingItem = z.infer<typeof UpdateClothingItemSchema>;
