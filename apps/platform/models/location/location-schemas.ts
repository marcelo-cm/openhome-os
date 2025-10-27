import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { locationMemberships, locations } from '@/db/db-schema';

export const LocationSchema = createSelectSchema(locations);
export const CreateLocationSchema = createInsertSchema(locations);
export const UpdateLocationSchema = createInsertSchema(locations);

export const LocationMembershipSchema = createSelectSchema(locationMemberships);
export const CreateLocationMembershipSchema =
  createInsertSchema(locationMemberships);
export const UpdateLocationMembershipSchema =
  createInsertSchema(locationMemberships).partial();
