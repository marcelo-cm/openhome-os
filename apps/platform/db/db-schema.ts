import { pgTable, text } from 'drizzle-orm/pg-core';

import { DrizzleBaseModel } from '@/models/base/base-types';
import { OrganizationTier } from '@/models/organization/organization-enums';
import { UserRole } from '@/models/user/user-enums';

import { OrganizationTierEnum, RbacRoleEnum, UserRoleEnum } from './enums';

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

// EXAMPLES BELOW ON ACL

/**
 * Post resource.
 *
 * - Has a specific user as the owner (used for IS_OWNER checks).
 * - Can also be governed by per-item ACLs in the post_acl table.
 */
// export const posts = pgTable('posts', {
//   ...DrizzleBaseModel,
//   title: text('title').notNull(),
//   principal_id: text('principal_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   organization_id: text('organization_id')
//     .notNull()
//     .references(() => organizations.id, {
//       onDelete: 'cascade',
//     }),
//   project_id: text('project_id')
//     .notNull()
//     .references(() => projects.id, {
//       onDelete: 'cascade',
//     }),
// });

/**
 * Per-item ACL assignments for posts.
 *
 * - Associates a user with an ACL role on a specific post instance.
 * - ACL roles (OWNER, EDITOR, VIEWER) provide fine-grained control
 *   in addition to RBAC roles.
 *
 * Questions:
 * - Should we make this a polymorphic table that holds all ACLs for all resources?
 */
// export const postAcl = pgTable('post_acl', {
//   ...DrizzleBaseModel,
//   post_id: text('post_id')
//     .notNull()
//     .references(() => posts.id, { onDelete: 'cascade' }),
//   user_id: text('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   acl_role: AclRoleEnum('acl_role').notNull(),
// });
