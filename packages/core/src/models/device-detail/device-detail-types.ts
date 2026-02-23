import type {
  CreateDeviceDetailSchema,
  DeviceDetailSchema,
  UpdateDeviceDetailSchema,
} from '@openhome-os/core/models/device-detail/device-detail-schemas';
import type { z } from 'zod';

export type TDeviceDetail = z.infer<typeof DeviceDetailSchema>;
export type TCreateDeviceDetail = z.infer<typeof CreateDeviceDetailSchema>;
export type TUpdateDeviceDetail = z.infer<typeof UpdateDeviceDetailSchema>;
