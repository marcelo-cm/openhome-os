import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { projectMemberships, projects } from '@/db/db-schema';
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
  createProject: async (project: TCreateProject): Promise<TProject[]> => {
    return db.insert(projects).values(project).returning();
  },
  /**
   * @description Get a project by their ID
   * @param id - The ID of the project to get
   * @returns The project with the given ID
   */
  getProject: async (id: string): Promise<TProject | undefined> => {
    return db.query.projects.findFirst({
      where: eq(projects.id, id),
    });
  },
  /**
   * @description Get projects belonging to an organization by the organization ID
   * @param id — The ID of the organization whose projects to get
   * @returns The projects belonging to the given organization
   */
  getProjectsByOrganization: async (
    id: string,
  ): Promise<TProject[] | undefined> => {
    return db.query.projects.findMany({
      where: eq(projects.organization_id, id),
    });
  },
  /**
   * @description Get all projects
   * @returns All projects
   */
  getAllProject: async (): Promise<TProject[]> => {
    return db.query.projects.findMany();
  },
  /**
   * @description Update a project by their ID
   * @param id - The ID of the project to update
   * @param project - The project to update
   * @returns The updated project
   */
  updateProject: async (
    id: string,
    project: TUpdateProject,
  ): Promise<TProject[]> => {
    return db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
  },
  /**
   * @description Delete a project by their ID
   * @param id - The ID of the project to delete
   * @returns The deleted project
   */
  deleteProject: async (id: string): Promise<TProject[]> => {
    return db.delete(projects).where(eq(projects.id, id)).returning();
  },
  addMemberToProject: async (projectId: string, userId: string) => {
    return db.insert(projectMemberships).values({
      project_id: projectId,
      user_id: userId,
      rbac_role: RbacRole.MEMBER,
    });
  },
  addAdminToProject: async (
    projectId: string,
    userId: string,
  ): Promise<TProjectMembership[]> => {
    return db
      .insert(projectMemberships)
      .values({
        project_id: projectId,
        user_id: userId,
        rbac_role: RbacRole.ADMIN,
      })
      .returning();
  },
};

export default ProjectService;
