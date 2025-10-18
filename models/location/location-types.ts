import { z } from 'zod';

import {
  CreateLocationMembershipSchema,
  CreateLocationSchema,
  LocationMembershipSchema,
  LocationSchema,
  UpdateLocationMembershipSchema,
  UpdateLocationSchema,
} from '@/models/location/location-schemas';

export type TLocation = z.infer<typeof LocationSchema>;
export type TCreateLocation = z.infer<typeof CreateLocationSchema>;
export type TUpdateLocation = z.infer<typeof UpdateLocationSchema>;

export type TLocationMembership = z.infer<typeof LocationMembershipSchema>;
export type TCreateLocationMembership = z.infer<
  typeof CreateLocationMembershipSchema
>;
export type TUpdateLocationMembership = z.infer<
  typeof UpdateLocationMembershipSchema
>;
