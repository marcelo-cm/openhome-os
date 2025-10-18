import { and, eq } from 'drizzle-orm';

import { db } from '@/db/db';
import {
  organizationMemberships,
  postAcl,
  projectMemberships,
} from '@/db/db-schema';
import { TOrganizationMembership } from '@/models/organization/organization-types';

import { TProjectMembership } from '../models/project/project-types';

/**
 * Interactions with the database for permissions on any resource
 */
const PermissionService = {
  getUserRoleForProject: async (
    userId: string,
    projectId: string,
  ): Promise<TProjectMembership | undefined> => {
    return db.query.projectMemberships.findFirst({
      where: and(
        eq(projectMemberships.user_id, userId),
        eq(projectMemberships.project_id, projectId),
      ),
    });
  },
  getUserRoleForOrganization: async (
    userId: string,
    organizationId: string,
  ): Promise<TOrganizationMembership | undefined> => {
    return db.query.organizationMemberships.findFirst({
      where: and(
        eq(organizationMemberships.user_id, userId),
        eq(organizationMemberships.organization_id, organizationId),
      ),
    });
  },
};

export default PermissionService;
