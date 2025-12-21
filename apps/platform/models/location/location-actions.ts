'use server';

import {
  TCreateLocation,
  TLocation,
  TLocationMembershipHydrated,
  TUpdateLocation,
} from '@/models/location/location-types';
import { getCurrentUser } from '@/models/user/user-actions';

import LocationService from './location-service';

// Create
export async function createLocation({
  data,
}: {
  data: TCreateLocation;
}): Promise<TLocation | undefined> {
  try {
    const [location] = await LocationService.createLocation({
      location: data,
    });

    return location;
  } catch (error) {
    console.error('[createLocation]', error);
    throw new Error('Failed to create Location');
  }
}

// Read (Get All)
export async function getLocations(): Promise<TLocation[]> {
  try {
    const locations = await LocationService.getAllLocation();

    return locations;
  } catch (error) {
    console.error('[getLocations]', error);
    throw new Error('Failed to get Locations');
  }
}

// Read (Get)
export async function getLocation({ id }: { id: string }): Promise<TLocation> {
  try {
    const location = await LocationService.getLocation({ id });

    if (!location) {
      throw new Error('Location not found');
    }

    return location;
  } catch (error) {
    console.error('[getLocation]', error);
    throw new Error('Failed to get Location');
  }
}

// Update
export async function updateLocation({
  id,
  data,
}: {
  id: string;
  data: TUpdateLocation;
}): Promise<TLocation> {
  try {
    const [location] = await LocationService.updateLocation({
      id,
      location: data,
    });

    if (!location) {
      throw new Error('Location not found');
    }

    return location;
  } catch (error) {
    console.error('[updateLocation]', error);
    throw new Error('Failed to update Location');
  }
}

// Delete
export async function deleteLocation({
  id,
}: {
  id: string;
}): Promise<TLocation> {
  try {
    const [location] = await LocationService.deleteLocation({ id });

    if (!location) {
      throw new Error('Location not found');
    }

    return location;
  } catch (error) {
    console.error('[deleteLocation]', error);
    throw new Error('Failed to delete Location');
  }
}

// Read (Get Location Memberships)
export async function getLocationMemberships({
  locationId,
}: {
  locationId: string;
}): Promise<TLocationMembershipHydrated[]> {
  try {
    const memberships =
      await LocationService.getLocationMembershipsByLocationId({
        locationId,
      });

    return memberships;
  } catch (error) {
    console.error('[getLocationMemberships]', error);
    throw new Error('Failed to get Location Memberships');
  }
}

// Create (Add Member to Location)
export async function addMemberToLocation({
  locationId,
  userId,
}: {
  locationId: string;
  userId: string;
}): Promise<TLocationMembershipHydrated> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const [membership] = await LocationService.addMemberToLocation({
      locationId,
      principalId: currentUser.id,
      userId,
    });

    if (!membership) {
      throw new Error('Failed to add member');
    }

    // Fetch the membership with user data to return
    const memberships =
      await LocationService.getLocationMembershipsByLocationId({
        locationId,
      });

    const addedMembership = memberships.find((m) => m.id === membership.id);

    if (!addedMembership) {
      throw new Error('Failed to fetch added membership');
    }

    return addedMembership;
  } catch (error) {
    console.error('[addMemberToLocation]', error);
    throw new Error('Failed to add member to Location');
  }
}

// Create (Add Admin to Location)
export async function addAdminToLocation({
  locationId,
  userId,
}: {
  locationId: string;
  userId: string;
}): Promise<TLocationMembershipHydrated> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const [membership] = await LocationService.addAdminToLocation({
      principalId: currentUser.id,
      locationId,
      userId,
    });

    if (!membership) {
      throw new Error('Failed to add admin');
    }

    // Fetch the membership with user data to return
    const memberships =
      await LocationService.getLocationMembershipsByLocationId({
        locationId,
      });

    const addedMembership = memberships.find((m) => m.id === membership.id);

    if (!addedMembership) {
      throw new Error('Failed to fetch added membership');
    }

    return addedMembership;
  } catch (error) {
    console.error('[addAdminToLocation]', error);
    throw new Error('Failed to add admin to Location');
  }
}
