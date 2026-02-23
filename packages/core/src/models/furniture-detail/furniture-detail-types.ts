import type {
  CreateFurnitureDetailSchema,
  FurnitureDetailSchema,
  UpdateFurnitureDetailSchema,
} from '@openhome-os/core/models/furniture-detail/furniture-detail-schemas';
import type { z } from 'zod';

export type TFurnitureDetail = z.infer<typeof FurnitureDetailSchema>;
export type TCreateFurnitureDetail = z.infer<
  typeof CreateFurnitureDetailSchema
>;
export type TUpdateFurnitureDetail = z.infer<
  typeof UpdateFurnitureDetailSchema
>;
