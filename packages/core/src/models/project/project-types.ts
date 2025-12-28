import {
  CreateProjectMembershipSchema,
  CreateProjectSchema,
  ProjectMembershipSchema,
  ProjectSchema,
  UpdateProjectMembershipSchema,
  UpdateProjectSchema,
} from '@openhome-os/core/models/project/project-schemas';
import { z } from 'zod';

export type TProject = z.infer<typeof ProjectSchema>;
export type TCreateProject = z.infer<typeof CreateProjectSchema>;
export type TUpdateProject = z.infer<typeof UpdateProjectSchema>;

export type TProjectMembership = z.infer<typeof ProjectMembershipSchema>;
export type TCreateProjectMembership = z.infer<
  typeof CreateProjectMembershipSchema
>;
export type TUpdateProjectMembership = z.infer<
  typeof UpdateProjectMembershipSchema
>;
