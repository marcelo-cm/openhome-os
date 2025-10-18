'use server';

import {
  TCreateLocation,
  TLocation,
  TUpdateLocation,
} from '@/models/location/location-types';

import LocationService from './location-service';

// Create
export async function createLocation({
  data,
}: {
  data: TCreateLocation;
}): Promise<TLocation> {
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
