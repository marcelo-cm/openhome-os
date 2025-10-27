import { eq } from 'drizzle-orm';

import { db } from '@/db/db';
import { organizationMemberships, organizations } from '@/db/db-schema';
import {
  TCreateOrganization,
  TOrganization,
  TOrganizationMembership,
  TUpdateOrganization,
} from '@/models/organization/organization-types';
import { RbacRole } from '@/permissions/rbac-enums';

/**
 * Interactions with the database for Organization
 */
const OrganizationService = {
  /**
   * @description Create a organization
   * @param organization - The organization to create
   * @returns The created organization
   */
  createOrganization: async ({
    organization,
  }: {
    organization: TCreateOrganization;
  }): Promise<TOrganization[]> => {
    return db.insert(organizations).values(organization).returning();
  },
  /**
   * @description Get a organization by their ID
   * @param id - The ID of the organization to get
   * @returns The organization with the given ID
   */
  getOrganization: async ({
    id,
  }: {
    id: string;
  }): Promise<TOrganization | undefined> => {
    return db.query.organizations.findFirst({
      where: eq(organizations.id, id),
    });
  },
  /**
   * @description Get all organizations
   * @returns All organizations
   */
  getAllOrganization: async (): Promise<TOrganization[]> => {
    return db.query.organizations.findMany();
  },
  /**
   * @description Update a organization by their ID
   * @param id - The ID of the organization to update
   * @param organization - The organization to update
   * @returns The updated organization
   */
  updateOrganization: async ({
    id,
    organization,
  }: {
    id: string;
    organization: TUpdateOrganization;
  }): Promise<TOrganization[]> => {
    return db
      .update(organizations)
      .set(organization)
      .where(eq(organizations.id, id))
      .returning();
  },
  /**
   * @description Delete a organization by their ID
   * @param id - The ID of the organization to delete
   * @returns The deleted organization
   */
  deleteOrganization: async ({
    id,
  }: {
    id: string;
  }): Promise<TOrganization[]> => {
    return db.delete(organizations).where(eq(organizations.id, id)).returning();
  },
  addMemberToOrganization: async ({
    organizationId,
    principalId,
    userId,
  }: {
    organizationId: string;
    principalId: string;
    userId: string;
  }): Promise<TOrganizationMembership[]> => {
    return db.insert(organizationMemberships).values({
      principal_id: principalId,
      organization_id: organizationId,
      user_id: userId,
      rbac_role: RbacRole.MEMBER,
    });
  },
  addAdminToOrganization: async ({
    principalId,
    organizationId,
    userId,
  }: {
    principalId: string;
    organizationId: string;
    userId: string;
  }): Promise<TOrganizationMembership[]> => {
    return db
      .insert(organizationMemberships)
      .values({
        principal_id: principalId,
        organization_id: organizationId,
        user_id: userId,
        rbac_role: RbacRole.ADMIN,
      })
      .returning();
  },
};

export default OrganizationService;
