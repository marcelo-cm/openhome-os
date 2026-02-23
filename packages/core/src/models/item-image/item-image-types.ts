import type {
  CreateItemImageSchema,
  ItemImageSchema,
  UpdateItemImageSchema,
} from '@openhome-os/core/models/item-image/item-image-schemas';
import type { z } from 'zod';

export type TItemImage = z.infer<typeof ItemImageSchema>;
export type TCreateItemImage = z.infer<typeof CreateItemImageSchema>;
export type TUpdateItemImage = z.infer<typeof UpdateItemImageSchema>;
