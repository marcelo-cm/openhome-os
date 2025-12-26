import { eq } from 'drizzle-orm';

import { Database } from '@/db/db';
import { locationMemberships, locations } from '@/db/db-schema';
import { supportsTransaction } from '@/db/db-utils';
import {
  TCreateLocation,
  TLocation,
  TLocationMembership,
  TLocationMembershipHydrated,
  TUpdateLocation,
} from '@/models/location/location-types';
import { RbacRole } from '@/permissions/rbac-enums';

/**
 * Interactions with the database for Location
 */
const LocationService = {
  /**
   * @description Create a location
   * @param location - The location to create
   * @returns The created location
   */
  createLocation: supportsTransaction(
    async ({
      location,
      db,
    }: {
      location: TCreateLocation;
      db: Database;
    }): Promise<TLocation[]> => {
      return db.insert(locations).values(location).returning();
    },
  ),
  /**
   * @description Get a location by their ID
   * @param id - The ID of the location to get
   * @returns The location with the given ID
   */
  getLocation: supportsTransaction(
    async ({
      id,
      db,
    }: {
      id: string;
      db: Database;
    }): Promise<TLocation | undefined> => {
      return db.query.locations.findFirst({
        where: eq(locations.id, id),
      });
    },
  ),
  /**
   * @description Get all locations
   * @returns All locations
   */
  getAllLocation: supportsTransaction(
    async ({ db }: { db: Database }): Promise<TLocation[]> => {
      return db.query.locations.findMany();
    },
  ),
  /**
   * @description Update a location by their ID
   * @param id - The ID of the location to update
   * @param location - The location to update
   * @returns The updated location
   */
  updateLocation: supportsTransaction(
    async ({
      id,
      location,
      db,
    }: {
      id: string;
      location: TUpdateLocation;
      db: Database;
    }): Promise<TLocation[]> => {
      return db
        .update(locations)
        .set(location)
        .where(eq(locations.id, id))
        .returning();
    },
  ),
  /**
   * @description Delete a location by their ID
   * @param id - The ID of the location to delete
   * @returns The deleted location
   */
  deleteLocation: supportsTransaction(
    async ({ id, db }: { id: string; db: Database }): Promise<TLocation[]> => {
      return db.delete(locations).where(eq(locations.id, id)).returning();
    },
  ),
  addMemberToLocation: supportsTransaction(
    async ({
      locationId,
      principalId,
      userId,
      db,
    }: {
      locationId: string;
      principalId: string;
      userId: string;
      db: Database;
    }): Promise<TLocationMembership[]> => {
      return db
        .insert(locationMemberships)
        .values({
          principal_id: principalId,
          location_id: locationId,
          user_id: userId,
          rbac_role: RbacRole.MEMBER,
        })
        .returning();
    },
  ),
  addAdminToLocation: supportsTransaction(
    async ({
      principalId,
      locationId,
      userId,
      db,
    }: {
      principalId: string;
      locationId: string;
      userId: string;
      db: Database;
    }): Promise<TLocationMembership[]> => {
      return db
        .insert(locationMemberships)
        .values({
          principal_id: principalId,
          location_id: locationId,
          user_id: userId,
          rbac_role: RbacRole.ADMIN,
        })
        .returning();
    },
  ),
  /**
   * @description Get location memberships by location ID with user data
   * @param locationId - The ID of the location
   * @returns Array of location memberships with user data
   */
  getLocationMembershipsByLocationId: supportsTransaction(
    async ({
      locationId,
      db,
    }: {
      locationId: string;
      db: Database;
    }): Promise<TLocationMembershipHydrated[]> => {
      const memberships = await db.query.locationMemberships.findMany({
        where: eq(locationMemberships.location_id, locationId),
        with: {
          user: true,
        },
      });

      return memberships as TLocationMembershipHydrated[];
    },
  ),
};

export default LocationService;
