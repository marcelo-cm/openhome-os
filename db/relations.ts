import { relations } from 'drizzle-orm';

import {
  organizationMemberships,
  organizations,
  postAcl,
  posts,
  projectMemberships,
  projects,
  userRbacRoles,
  users,
} from './db-schema';

export const usersRelations = relations(users, ({ many }) => ({
  globalRoles: many(userRbacRoles),
  orgMemberships: many(organizationMemberships),
  projectMemberships: many(projectMemberships),
  ownedPosts: many(posts),
  postAclEntries: many(postAcl),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(organizationMemberships),
  projects: many(projects),
  posts: many(posts),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organization_id], // nullable FK supported
    references: [organizations.id],
  }),
  memberships: many(projectMemberships),
  posts: many(posts),
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

export const postsRelations = relations(posts, ({ one, many }) => ({
  owner: one(users, {
    fields: [posts.owner_id],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [posts.organization_id],
    references: [organizations.id],
  }),
  project: one(projects, {
    fields: [posts.project_id],
    references: [projects.id],
  }),
  aclEntries: many(postAcl),
}));

export const postAclRelations = relations(postAcl, ({ one }) => ({
  post: one(posts, {
    fields: [postAcl.post_id],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postAcl.user_id],
    references: [users.id],
  }),
}));
