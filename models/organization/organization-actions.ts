'use server';

import {
  TCreateOrganization,
  TOrganization,
  TUpdateOrganization,
} from '@/models/organization/organization-types';

import OrganizationService from './organization-service';

// Create
export async function createOrganization({
  data,
}: {
  data: TCreateOrganization;
}): Promise<TOrganization> {
  try {
    const [organization] = await OrganizationService.createOrganization({
      organization: data,
    });

    return organization;
  } catch (error) {
    console.error('[createOrganization]', error);
    throw new Error('Failed to create Organization');
  }
}

// Read (Get All)
export async function getOrganizations(): Promise<TOrganization[]> {
  try {
    const organizations = await OrganizationService.getAllOrganization();

    return organizations;
  } catch (error) {
    console.error('[getOrganizations]', error);
    throw new Error('Failed to get Organizations');
  }
}

// Read (Get)
export async function getOrganization({
  id,
}: {
  id: string;
}): Promise<TOrganization> {
  try {
    const organization = await OrganizationService.getOrganization({ id });

    if (!organization) {
      throw new Error('Organization not found');
    }

    return organization;
  } catch (error) {
    console.error('[getOrganization]', error);
    throw new Error('Failed to get Organization');
  }
}

// Update
export async function updateOrganization({
  id,
  data,
}: {
  id: string;
  data: TUpdateOrganization;
}): Promise<TOrganization> {
  try {
    const [organization] = await OrganizationService.updateOrganization({
      id,
      organization: data,
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    return organization;
  } catch (error) {
    console.error('[updateOrganization]', error);
    throw new Error('Failed to update Organization');
  }
}

// Delete
export async function deleteOrganization({
  id,
}: {
  id: string;
}): Promise<TOrganization> {
  try {
    const [organization] = await OrganizationService.deleteOrganization({ id });

    if (!organization) {
      throw new Error('Organization not found');
    }

    return organization;
  } catch (error) {
    console.error('[deleteOrganization]', error);
    throw new Error('Failed to delete Organization');
  }
}
