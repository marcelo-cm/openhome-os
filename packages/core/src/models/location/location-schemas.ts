import { locationMemberships, locations } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const LocationSchema = createSelectSchema(locations);
export const CreateLocationSchema = createInsertSchema(locations);
export const UpdateLocationSchema = createInsertSchema(locations);

export const LocationMembershipSchema = createSelectSchema(locationMemberships);
export const CreateLocationMembershipSchema =
  createInsertSchema(locationMemberships);
export const UpdateLocationMembershipSchema =
  createInsertSchema(locationMemberships).partial();
