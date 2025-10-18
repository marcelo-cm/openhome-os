import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { organizationMemberships, organizations } from '@/db/db-schema';

export const OrganizationSchema = createSelectSchema(organizations);
export const CreateOrganizationSchema = createInsertSchema(organizations);
export const UpdateOrganizationSchema = createInsertSchema(organizations);

export const OrganizationMembershipSchema = createSelectSchema(
  organizationMemberships,
);
export const CreateOrganizationMembershipSchema = createInsertSchema(
  organizationMemberships,
);
export const UpdateOrganizationMembershipSchema = createInsertSchema(
  organizationMemberships,
).partial();
