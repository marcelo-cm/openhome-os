import type {
  ClothingDetailSchema,
  CreateClothingDetailSchema,
  UpdateClothingDetailSchema,
} from '@openhome-os/core/models/clothing-detail/clothing-detail-schemas';
import type { z } from 'zod';

export type TClothingDetail = z.infer<typeof ClothingDetailSchema>;
export type TCreateClothingDetail = z.infer<typeof CreateClothingDetailSchema>;
export type TUpdateClothingDetail = z.infer<typeof UpdateClothingDetailSchema>;
