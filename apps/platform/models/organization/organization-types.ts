import { z } from 'zod';

import {
  CreateOrganizationMembershipSchema,
  CreateOrganizationSchema,
  OrganizationMembershipSchema,
  OrganizationSchema,
  UpdateOrganizationMembershipSchema,
  UpdateOrganizationSchema,
} from '@/models/organization/organization-schemas';

export type TOrganization = z.infer<typeof OrganizationSchema>;
export type TCreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type TUpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;

export type TOrganizationMembership = z.infer<
  typeof OrganizationMembershipSchema
>;
export type TCreateOrganizationMembership = z.infer<
  typeof CreateOrganizationMembershipSchema
>;
export type TUpdateOrganizationMembership = z.infer<
  typeof UpdateOrganizationMembershipSchema
>;
