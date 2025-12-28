import { projectMemberships, projects } from '@openhome-os/core/db/db-schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const ProjectSchema = createSelectSchema(projects);
export const CreateProjectSchema = createInsertSchema(projects);
export const UpdateProjectSchema = createInsertSchema(projects).partial();

export const ProjectMembershipSchema = createSelectSchema(projectMemberships);
export const CreateProjectMembershipSchema =
  createInsertSchema(projectMemberships);
export const UpdateProjectMembershipSchema =
  createInsertSchema(projectMemberships).partial();
