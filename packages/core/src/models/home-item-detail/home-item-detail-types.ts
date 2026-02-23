import type {
  CreateHomeItemDetailSchema,
  HomeItemDetailSchema,
  UpdateHomeItemDetailSchema,
} from '@openhome-os/core/models/home-item-detail/home-item-detail-schemas';
import type { z } from 'zod';

export type THomeItemDetail = z.infer<typeof HomeItemDetailSchema>;
export type TCreateHomeItemDetail = z.infer<typeof CreateHomeItemDetailSchema>;
export type TUpdateHomeItemDetail = z.infer<typeof UpdateHomeItemDetailSchema>;
