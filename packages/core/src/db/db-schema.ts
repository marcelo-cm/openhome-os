import { DrizzleBaseModel } from '@openhome-os/core/models/base/base-types';
import {
  ItemPrivacy,
  ItemStatus,
} from '@openhome-os/core/models/item/item-enums';
import { OrganizationTier } from '@openhome-os/core/models/organization/organization-enums';
import { UserRole } from '@openhome-os/core/models/user/user-enums';
import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
} from 'drizzle-orm/pg-core';

import {
  ItemCategoryEnum,
  ItemPrivacyEnum,
  ItemStatusEnum,
  OrganizationTierEnum,
  RbacRoleEnum,
  UserRoleEnum,
} from './enums';

export const organizations = pgTable('organizations', {
  ...DrizzleBaseModel,
  name: text('name').notNull(),
  logo_url: text('logo_url'),
  tier: OrganizationTierEnum('tier').notNull().default(OrganizationTier.FREE),
});

export const projects = pgTable('projects', {
  ...DrizzleBaseModel,
  name: text('name').notNull(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
});

export const locations = pgTable('locations', {
  ...DrizzleBaseModel,
  name: text('name').notNull(),
  project_id: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
});

export const users = pgTable('users', {
  ...DrizzleBaseModel,
  first_name: text('first_name').notNull(),
  last_name: text('last_name'),
  email: text('email').notNull().unique(),
  role: UserRoleEnum('role').notNull().default(UserRole.USER),
  profile_picture_url: text('profile_picture_url'),
  organization_id: text('organization_id').references(() => organizations.id, {
    onDelete: 'cascade',
  }),
});

/**
 * Global RBAC role assignments.
 *
 * - Associates a user with one or more RBAC roles that apply globally.
 * - Intended for SUPER_ADMIN.
 *
 * Questions:
 * - How should we rename this table?
 */
export const userRbacRoles = pgTable('user_rbac_roles', {
  ...DrizzleBaseModel,
  principal_id: text('principal_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rbac_role: RbacRoleEnum('rbac_role').notNull(),
});

/**
 * Organization-scoped RBAC memberships.
 *
 * - Associates a user with a role in a specific organization.
 * - Roles determine what actions the user can attempt within that org.
 */
export const organizationMemberships = pgTable('organization_memberships', {
  ...DrizzleBaseModel,
  principal_id: text('principal_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rbac_role: RbacRoleEnum('rbac_role').notNull(),
});

/**
 * Project-scoped RBAC memberships.
 *
 * - Associates a user with a role in a specific project.
 * - Projects may belong to an org or stand alone.
 */
export const projectMemberships = pgTable('project_memberships', {
  ...DrizzleBaseModel,
  principal_id: text('principal_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  project_id: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rbac_role: RbacRoleEnum('rbac_role').notNull(),
});

/**
 * Location-scoped RBAC memberships.
 *
 * - Associates a user with a role in a specific location.
 * - Locations may belong to a project or stand alone.
 */
export const locationMemberships = pgTable('location_memberships', {
  ...DrizzleBaseModel,
  principal_id: text('principal_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  location_id: text('location_id')
    .notNull()
    .references(() => locations.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rbac_role: RbacRoleEnum('rbac_role').notNull(),
});

/**
 * Base item table — every physical item the user owns.
 * Category-specific attributes live in extension tables (CTI pattern).
 *
 * FK: principal_id → users.id (item owner)
 * FK: location_id → locations.id (current location)
 * Discriminator: category determines which extension table holds details.
 */
export const items = pgTable('items', {
  ...DrizzleBaseModel,
  category: ItemCategoryEnum('category').notNull(),
  principal_id: text('principal_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  location_id: text('location_id')
    .notNull()
    .references(() => locations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  brand: text('brand'),
  base_color: text('base_color'),
  notes: text('notes'),
  purchase_price: numeric('purchase_price', { precision: 8, scale: 2 }),
  purchase_date: date('purchase_date'),
  status: ItemStatusEnum('status').notNull().default(ItemStatus.ACTIVE),
  privacy: ItemPrivacyEnum('privacy').notNull().default(ItemPrivacy.PRIVATE),
});

/**
 * Clothing-specific details (1:1 with items WHERE category = 'clothing').
 *
 * PK/FK: item_id → items.id (also serves as the primary key, enforcing 1:1)
 */
export const clothingDetails = pgTable('clothing_details', {
  item_id: text('item_id')
    .primaryKey()
    .references(() => items.id, { onDelete: 'cascade' }),
  size: text('size'),
  material: text('material'),
  care_instructions: text('care_instructions'),
});

/**
 * Device-specific details (1:1 with items WHERE category = 'device').
 *
 * PK/FK: item_id → items.id
 */
export const deviceDetails = pgTable('device_details', {
  item_id: text('item_id')
    .primaryKey()
    .references(() => items.id, { onDelete: 'cascade' }),
  serial_number: text('serial_number'),
  model_number: text('model_number'),
  warranty_expiration: date('warranty_expiration'),
});

/**
 * Home item-specific details (1:1 with items WHERE category = 'home').
 *
 * PK/FK: item_id → items.id
 */
export const homeItemDetails = pgTable('home_item_details', {
  item_id: text('item_id')
    .primaryKey()
    .references(() => items.id, { onDelete: 'cascade' }),
  model_number: text('model_number'),
  warranty_expiration: date('warranty_expiration'),
});

/**
 * Furniture-specific details (1:1 with items WHERE category = 'furniture').
 *
 * PK/FK: item_id → items.id
 */
export const furnitureDetails = pgTable('furniture_details', {
  item_id: text('item_id')
    .primaryKey()
    .references(() => items.id, { onDelete: 'cascade' }),
  dimensions: jsonb('dimensions'),
});

/**
 * Personal item-specific details (1:1 with items WHERE category = 'personal').
 *
 * PK/FK: item_id → items.id
 */
export const personalItemDetails = pgTable('personal_item_details', {
  item_id: text('item_id')
    .primaryKey()
    .references(() => items.id, { onDelete: 'cascade' }),
  material: text('material'),
  replacement_cycle_days: integer('replacement_cycle_days'),
});

/**
 * Images attached to items (1:N with items).
 *
 * FK: item_id → items.id
 * Cascade: deleting an item removes all its images.
 */
export const itemImages = pgTable('item_images', {
  ...DrizzleBaseModel,
  item_id: text('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  storage_path: text('storage_path').notNull(),
  display_order: integer('display_order').notNull().default(0),
});
