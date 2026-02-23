import { furnitureDetails } from '@openhome-os/core/db/db-schema';
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

export const FurnitureDetailSchema = createSelectSchema(
  furnitureDetails,
).extend({
  dimensions: DimensionsSchema,
});
export const CreateFurnitureDetailSchema = createInsertSchema(
  furnitureDetails,
).extend({
  dimensions: DimensionsSchema.optional(),
});
export const UpdateFurnitureDetailSchema = createInsertSchema(furnitureDetails)
  .extend({
    dimensions: DimensionsSchema.optional(),
  })
  .partial()
  .required({ item_id: true });
