import {
  ClothingItemSchema,
  CreateClothingItemSchema,
  UpdateClothingItemSchema,
} from '@openhome-os/core/models/clothing-item/clothing-item-schemas';
import { z } from 'zod';

export type TClothingItem = z.infer<typeof ClothingItemSchema>;
export type TCreateClothingItem = z.infer<typeof CreateClothingItemSchema>;
export type TUpdateClothingItem = z.infer<typeof UpdateClothingItemSchema>;
