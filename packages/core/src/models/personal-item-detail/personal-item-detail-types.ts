import type {
  CreatePersonalItemDetailSchema,
  PersonalItemDetailSchema,
  UpdatePersonalItemDetailSchema,
} from '@openhome-os/core/models/personal-item-detail/personal-item-detail-schemas';
import type { z } from 'zod';

export type TPersonalItemDetail = z.infer<typeof PersonalItemDetailSchema>;
export type TCreatePersonalItemDetail = z.infer<
  typeof CreatePersonalItemDetailSchema
>;
export type TUpdatePersonalItemDetail = z.infer<
  typeof UpdatePersonalItemDetailSchema
>;
