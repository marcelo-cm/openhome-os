import { relations } from 'drizzle-orm';

import {
  organizationMemberships,
  organizations,
  projectMemberships,
  projects,
  userRbacRoles,
  users,
} from './db-schema';

export const usersRelations = relations(users, ({ many }) => ({
  globalRoles: many(userRbacRoles),
  orgMemberships: many(organizationMemberships),
  projectMemberships: many(projectMemberships),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(organizationMemberships),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organization_id], // nullable FK supported
    references: [organizations.id],
  }),
  memberships: many(projectMemberships),
}));

export const userRbacRolesRelations = relations(userRbacRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRbacRoles.user_id],
    references: [users.id],
  }),
}));

export const organizationMembershipsRelations = relations(
  organizationMemberships,
  ({ one }) => ({
    user: one(users, {
      fields: [organizationMemberships.user_id],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [organizationMemberships.organization_id],
      references: [organizations.id],
    }),
  }),
);

export const projectMembershipsRelations = relations(
  projectMemberships,
  ({ one }) => ({
    user: one(users, {
      fields: [projectMemberships.user_id],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [projectMemberships.project_id],
      references: [projects.id],
    }),
  }),
);
