import { eq } from 'drizzle-orm';

import { type Database } from '@/db/db';
import { projectMemberships, projects } from '@/db/db-schema';
import { supportsTransaction } from '@/db/db-utils';
import {
  TCreateProject,
  TProject,
  TProjectMembership,
  TUpdateProject,
} from '@/models/project/project-types';
import { RbacRole } from '@/permissions/rbac-enums';

/**
 * Interactions with the database for Project
 */
const ProjectService = {
  /**
   * @description Create a project
   * @param project - The project to create
   * @returns The created project
   */
  createProject: supportsTransaction(
    async ({
      project,
      db,
    }: {
      project: TCreateProject;
      db: Database;
    }): Promise<TProject[]> => {
      return db.insert(projects).values(project).returning();
    },
  ),
  /**
   * @description Get a project by their ID
   * @param id - The ID of the project to get
   * @returns The project with the given ID
   */
  getProject: supportsTransaction(
    async ({
      id,
      db,
    }: {
      id: string;
      db: Database;
    }): Promise<TProject | undefined> => {
      return db.query.projects.findFirst({
        where: eq(projects.id, id),
      });
    },
  ),
  /**
   * @description Get projects belonging to an organization by the organization ID
   * @param id — The ID of the organization whose projects to get
   * @returns The projects belonging to the given organization
   */
  getProjectsByOrganization: supportsTransaction(
    async ({
      id,
      db,
    }: {
      id: string;
      db: Database;
    }): Promise<TProject[] | undefined> => {
      return db.query.projects.findMany({
        where: eq(projects.organization_id, id),
      });
    },
  ),
  /**
   * @description Get all projects
   * @returns All projects
   */
  getAllProject: supportsTransaction(
    async ({ db }: { db: Database }): Promise<TProject[]> => {
      return db.query.projects.findMany();
    },
  ),
  /**
   * @description Update a project by their ID
   * @param id - The ID of the project to update
   * @param project - The project to update
   * @returns The updated project
   */
  updateProject: supportsTransaction(
    async ({
      id,
      project,
      db,
    }: {
      id: string;
      project: TUpdateProject;
      db: Database;
    }): Promise<TProject[]> => {
      return db
        .update(projects)
        .set(project)
        .where(eq(projects.id, id))
        .returning();
    },
  ),
  /**
   * @description Delete a project by their ID
   * @param id - The ID of the project to delete
   * @returns The deleted project
   */
  deleteProject: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }): Promise<TProject[]> => {
      return db.delete(projects).where(eq(projects.id, id)).returning();
    },
  ),
  addMemberToProject: supportsTransaction(
    async ({
      projectId,
      principalId,
      userId,
      db,
    }: {
      projectId: string;
      principalId: string;
      userId: string;
      db: Database;
    }): Promise<TProjectMembership[]> => {
      return db.insert(projectMemberships).values({
        principal_id: principalId,
        project_id: projectId,
        user_id: userId,
        rbac_role: RbacRole.MEMBER,
      });
    },
  ),
  addAdminToProject: supportsTransaction(
    async ({
      projectId,
      principalId,
      userId,
      db,
    }: {
      projectId: string;
      principalId: string;
      userId: string;
      db: Database;
    }): Promise<TProjectMembership[]> => {
      return db
        .insert(projectMemberships)
        .values({
          principal_id: principalId,
          project_id: projectId,
          user_id: userId,
          rbac_role: RbacRole.ADMIN,
        })
        .returning();
    },
  ),
};

export default ProjectService;
