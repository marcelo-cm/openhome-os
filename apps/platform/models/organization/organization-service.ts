import { eq } from 'drizzle-orm';

import { type Database } from '@/db/db';
import { organizationMemberships, organizations } from '@/db/db-schema';
import { supportsTransaction } from '@/db/db-utils';
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
  createOrganization: supportsTransaction(
    async ({
      organization,
      db,
    }: {
      organization: TCreateOrganization;
      db: Database;
    }): Promise<TOrganization[]> => {
      return db.insert(organizations).values(organization).returning();
    },
  ),
  /**
   * @description Get a organization by their ID
   * @param id - The ID of the organization to get
   * @returns The organization with the given ID
   */
  getOrganization: supportsTransaction(
    async ({
      id,
      db,
    }: {
      id: string;
      db: Database;
    }): Promise<TOrganization | undefined> => {
      return db.query.organizations.findFirst({
        where: eq(organizations.id, id),
      });
    },
  ),
  /**
   * @description Get all organizations
   * @returns All organizations
   */
  getAllOrganization: supportsTransaction(
    async ({ db }: { db: Database }): Promise<TOrganization[]> => {
      return db.query.organizations.findMany();
    },
  ),
  /**
   * @description Update a organization by their ID
   * @param id - The ID of the organization to update
   * @param organization - The organization to update
   * @returns The updated organization
   */
  updateOrganization: supportsTransaction(
    async ({
      id,
      organization,
      db,
    }: {
      id: string;
      organization: TUpdateOrganization;
      db: Database;
    }): Promise<TOrganization[]> => {
      return db
        .update(organizations)
        .set(organization)
        .where(eq(organizations.id, id))
        .returning();
    },
  ),
  /**
   * @description Delete a organization by their ID
   * @param id - The ID of the organization to delete
   * @returns The deleted organization
   */
  deleteOrganization: supportsTransaction(
    async ({
      id,
      db,
    }: {
      id: string;
      db: Database;
    }): Promise<TOrganization[]> => {
      return db
        .delete(organizations)
        .where(eq(organizations.id, id))
        .returning();
    },
  ),
  addMemberToOrganization: supportsTransaction(
    async ({
      organizationId,
      principalId,
      userId,
      db,
    }: {
      organizationId: string;
      principalId: string;
      userId: string;
      db: Database;
    }): Promise<TOrganizationMembership[]> => {
      return db.insert(organizationMemberships).values({
        principal_id: principalId,
        organization_id: organizationId,
        user_id: userId,
        rbac_role: RbacRole.MEMBER,
      });
    },
  ),
  addAdminToOrganization: supportsTransaction(
    async ({
      principalId,
      organizationId,
      userId,
      db,
    }: {
      principalId: string;
      organizationId: string;
      userId: string;
      db: Database;
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
  ),
};

export default OrganizationService;
