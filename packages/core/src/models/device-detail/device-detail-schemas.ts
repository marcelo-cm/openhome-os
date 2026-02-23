import { deviceDetails } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const DeviceDetailSchema = createSelectSchema(deviceDetails);
export const CreateDeviceDetailSchema = createInsertSchema(deviceDetails);
export const UpdateDeviceDetailSchema = createInsertSchema(deviceDetails)
  .partial()
  .required({ item_id: true });
