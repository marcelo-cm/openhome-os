import { z } from 'zod';

import { ItemPrivacy, ItemStatus } from './item-enums';

export const BasicInfoStepSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  brand: z.string().min(1, 'Brand is required'),
  base_color: z.string().optional(),
  notes: z.string().optional(),
  purchase_price: z.string().optional(),
  purchase_date: z.string().optional(),
});

export const PersonalDetailsStepSchema = z.object({
  material: z.string().optional(),
  replacement_cycle_days: z.number().int().positive(),
});

export const SettingsStepSchema = z.object({
  location_id: z.string().min(1, 'Location is required'),
  status: z.enum(ItemStatus).default(ItemStatus.ACTIVE),
  privacy: z.enum(ItemPrivacy).default(ItemPrivacy.PRIVATE),
});

export const ImagesStepSchema = z.object({
  images: z.array(z.any()).max(5).optional(),
});

export const PersonalItemRegistrationSchema = z.object({
  ...BasicInfoStepSchema.shape,
  ...PersonalDetailsStepSchema.shape,
  ...SettingsStepSchema.shape,
  ...ImagesStepSchema.shape,
});

export type TPersonalItemRegistration = z.infer<
  typeof PersonalItemRegistrationSchema
>;
