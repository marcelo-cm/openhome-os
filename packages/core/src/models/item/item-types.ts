import {
  CreateItemSchema,
  ItemSchema,
  UpdateItemSchema,
} from '@openhome-os/core/models/item/item-schemas';
import { z } from 'zod';

export type TItem = z.infer<typeof ItemSchema>;
export type TCreateItem = z.infer<typeof CreateItemSchema>;
export type TUpdateItem = z.infer<typeof UpdateItemSchema>;
