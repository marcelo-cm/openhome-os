import {
  ItemCategory,
  ItemPrivacy,
  ItemStatus,
} from '@openhome-os/core/models/item/item-enums';
import { OrganizationTier } from '@openhome-os/core/models/organization/organization-enums';
import { UserRole } from '@openhome-os/core/models/user/user-enums';
import {
  RbacResource,
  RbacRole,
} from '@openhome-os/core/permissions/rbac-enums';
import { pgEnum } from 'drizzle-orm/pg-core';

import { AclRole } from '../permissions/acl-enums';

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

// Item enums (generalized)
export const ItemCategoryEnum = pgEnum(
  'item_category',
  Object.values(ItemCategory) as [string, ...string[]],
);
export const ItemStatusEnum = pgEnum(
  'item_status',
  Object.values(ItemStatus) as [string, ...string[]],
);
export const ItemPrivacyEnum = pgEnum(
  'item_privacy',
  Object.values(ItemPrivacy) as [string, ...string[]],
);
