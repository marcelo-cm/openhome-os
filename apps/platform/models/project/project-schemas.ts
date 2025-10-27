import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { projectMemberships, projects } from '../../db/db-schema';

export const ProjectSchema = createSelectSchema(projects);
export const CreateProjectSchema = createInsertSchema(projects);
export const UpdateProjectSchema = createInsertSchema(projects).partial();

export const ProjectMembershipSchema = createSelectSchema(projectMemberships);
export const CreateProjectMembershipSchema =
  createInsertSchema(projectMemberships);
export const UpdateProjectMembershipSchema =
  createInsertSchema(projectMemberships).partial();
