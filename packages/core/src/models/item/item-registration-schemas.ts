import { z } from 'zod';

import { ITEM_CONSTANTS } from './item-constants';
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

export const ClothingDetailsStepSchema = z.object({
  size: z.string().optional(),
  material: z.string().optional(),
  care_instructions: z.string().optional(),
});

export const DeviceDetailsStepSchema = z.object({
  serial_number: z.string().optional(),
  model_number: z.string().optional(),
  warranty_expiration: z.string().optional(),
});

export const HomeDetailsStepSchema = z.object({
  model_number: z.string().optional(),
  warranty_expiration: z.string().optional(),
});

const FURNITURE_DIMENSION_UNITS = ['cm', 'in'] as const;

export const FurnitureDetailsStepSchema = z
  .object({
    dimension_width: z.number().positive().optional(),
    dimension_height: z.number().positive().optional(),
    dimension_depth: z.number().positive().optional(),
    dimension_unit: z.enum(FURNITURE_DIMENSION_UNITS).optional(),
  })
  .superRefine((value, context) => {
    const hasAnyValue =
      value.dimension_width !== undefined ||
      value.dimension_height !== undefined ||
      value.dimension_depth !== undefined ||
      value.dimension_unit !== undefined;

    if (!hasAnyValue) return;

    if (value.dimension_width === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Width is required when setting dimensions.',
        path: ['dimension_width'],
      });
    }

    if (value.dimension_height === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Height is required when setting dimensions.',
        path: ['dimension_height'],
      });
    }

    if (value.dimension_depth === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Depth is required when setting dimensions.',
        path: ['dimension_depth'],
      });
    }

    if (value.dimension_unit === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Unit is required when setting dimensions.',
        path: ['dimension_unit'],
      });
    }
  });

export const SettingsStepSchema = z.object({
  location_id: z.string().min(1, 'Location is required'),
  status: z.enum(ItemStatus).default(ItemStatus.ACTIVE),
  privacy: z.enum(ItemPrivacy).default(ItemPrivacy.PRIVATE),
});

function isFileLike(value: unknown): value is File {
  if (typeof File === 'undefined') return true;
  return value instanceof File;
}

export const ImagesStepSchema = z.object({
  images: z
    .array(
      z.custom<File>((value) => isFileLike(value), {
        message: 'Each image must be a valid file.',
      }),
    )
    .max(ITEM_CONSTANTS.MAX_IMAGES)
    .optional(),
});

export const PersonalItemRegistrationSchema = z.object({
  ...BasicInfoStepSchema.shape,
  ...PersonalDetailsStepSchema.shape,
  ...SettingsStepSchema.shape,
  ...ImagesStepSchema.shape,
});

export const ClothingItemRegistrationSchema = z.object({
  ...BasicInfoStepSchema.shape,
  ...ClothingDetailsStepSchema.shape,
  ...SettingsStepSchema.shape,
  ...ImagesStepSchema.shape,
});

export const DeviceItemRegistrationSchema = z.object({
  ...BasicInfoStepSchema.shape,
  ...DeviceDetailsStepSchema.shape,
  ...SettingsStepSchema.shape,
  ...ImagesStepSchema.shape,
});

export const HomeItemRegistrationSchema = z.object({
  ...BasicInfoStepSchema.shape,
  ...HomeDetailsStepSchema.shape,
  ...SettingsStepSchema.shape,
  ...ImagesStepSchema.shape,
});

export const FurnitureItemRegistrationSchema = z.object({
  ...BasicInfoStepSchema.shape,
  ...FurnitureDetailsStepSchema.shape,
  ...SettingsStepSchema.shape,
  ...ImagesStepSchema.shape,
});

export type TPersonalItemRegistration = z.infer<
  typeof PersonalItemRegistrationSchema
>;

export type TClothingItemRegistration = z.infer<
  typeof ClothingItemRegistrationSchema
>;

export type TDeviceItemRegistration = z.infer<typeof DeviceItemRegistrationSchema>;

export type THomeItemRegistration = z.infer<typeof HomeItemRegistrationSchema>;

export type TFurnitureItemRegistration = z.infer<
  typeof FurnitureItemRegistrationSchema
>;
