import { homeItemDetails } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const DimensionsSchema = z
  .object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
    unit: z.enum(['cm', 'in']),
  })
  .nullable();

export const HomeItemDetailSchema = createSelectSchema(homeItemDetails).extend({
  dimensions: DimensionsSchema,
});
export const CreateHomeItemDetailSchema = createInsertSchema(
  homeItemDetails,
).extend({
  dimensions: DimensionsSchema.optional(),
});
export const UpdateHomeItemDetailSchema = createInsertSchema(homeItemDetails)
  .extend({
    dimensions: DimensionsSchema.optional(),
  })
  .partial()
  .required({ item_id: true });
