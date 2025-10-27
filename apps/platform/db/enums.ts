import { pgEnum } from 'drizzle-orm/pg-core';

import { OrganizationTier } from '@/models/organization/organization-enums';
import { UserRole } from '@/models/user/user-enums';
import { AclRole } from '@/permissions/acl-enums';
import { RbacResource, RbacRole } from '@/permissions/rbac-enums';

export const UserRoleEnum = pgEnum(
  'role',
  Object.values(UserRole) as [string, ...string[]],
);

export const OrganizationTierEnum = pgEnum(
  'tier',
  Object.values(OrganizationTier) as [string, ...string[]],
);

export const RbacRoleEnum = pgEnum(
  'rbac_role',
  Object.values(RbacRole) as [string, ...string[]],
);

export const AclRoleEnum = pgEnum(
  'acl_role',
  Object.values(AclRole) as [string, ...string[]],
);

export const RbacResourceEnum = pgEnum(
  'rbac_resource',
  Object.values(RbacResource) as [string, ...string[]],
);
