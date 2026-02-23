import { relations } from 'drizzle-orm';

import {
  clothingDetails,
  deviceDetails,
  furnitureDetails,
  homeItemDetails,
  items,
  locationMemberships,
  locations,
  organizationMemberships,
  organizations,
  personalItemDetails,
  projectMemberships,
  projects,
  userRbacRoles,
  users,
} from './db-schema';

export const usersRelations = relations(users, ({ many }) => ({
  globalRoles: many(userRbacRoles),
  orgMemberships: many(organizationMemberships),
  projectMemberships: many(projectMemberships),
  locationMemberships: many(locationMemberships),
  items: many(items),
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
  locations: many(locations),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  project: one(projects, {
    fields: [locations.project_id],
    references: [projects.id],
  }),
  memberships: many(locationMemberships),
  items: many(items),
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

export const locationMembershipsRelations = relations(
  locationMemberships,
  ({ one }) => ({
    user: one(users, {
      fields: [locationMemberships.user_id],
      references: [users.id],
    }),
    location: one(locations, {
      fields: [locationMemberships.location_id],
      references: [locations.id],
    }),
  }),
);

export const itemsRelations = relations(items, ({ one }) => ({
  owner: one(users, {
    fields: [items.principal_id],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [items.location_id],
    references: [locations.id],
  }),
  clothingDetails: one(clothingDetails),
  deviceDetails: one(deviceDetails),
  homeItemDetails: one(homeItemDetails),
  furnitureDetails: one(furnitureDetails),
  personalItemDetails: one(personalItemDetails),
}));

export const clothingDetailsRelations = relations(
  clothingDetails,
  ({ one }) => ({
    item: one(items, {
      fields: [clothingDetails.item_id],
      references: [items.id],
    }),
  }),
);

export const deviceDetailsRelations = relations(deviceDetails, ({ one }) => ({
  item: one(items, {
    fields: [deviceDetails.item_id],
    references: [items.id],
  }),
}));

export const homeItemDetailsRelations = relations(
  homeItemDetails,
  ({ one }) => ({
    item: one(items, {
      fields: [homeItemDetails.item_id],
      references: [items.id],
    }),
  }),
);

export const furnitureDetailsRelations = relations(
  furnitureDetails,
  ({ one }) => ({
    item: one(items, {
      fields: [furnitureDetails.item_id],
      references: [items.id],
    }),
  }),
);

export const personalItemDetailsRelations = relations(
  personalItemDetails,
  ({ one }) => ({
    item: one(items, {
      fields: [personalItemDetails.item_id],
      references: [items.id],
    }),
  }),
);
