import {
  CreateLocationMembershipSchema,
  CreateLocationSchema,
  LocationMembershipSchema,
  LocationSchema,
  UpdateLocationMembershipSchema,
  UpdateLocationSchema,
} from '@openhome-os/core/models/location/location-schemas';
import type { TUser } from '@openhome-os/core/models/user/user-types';
import { z } from 'zod';

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

export type TLocationMembershipHydrated = TLocationMembership & {
  user: TUser;
};
