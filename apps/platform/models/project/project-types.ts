import { z } from 'zod';

import {
  CreateProjectMembershipSchema,
  CreateProjectSchema,
  ProjectMembershipSchema,
  ProjectSchema,
  UpdateProjectMembershipSchema,
  UpdateProjectSchema,
} from '@/models/project/project-schemas';

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
