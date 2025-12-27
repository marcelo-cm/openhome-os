'use server';

import { cache } from 'react';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import PermissionService from '@/permissions/permission-service';

import OrganizationService from '../../../../models/organization/organization-service';
import UserService from '../../../../models/user/user-service';
import type { PlatformAuthContext } from './platform-context-types';

/**
 * Uncached version of getPlatformAuthContext - useful for testing
 * Fetches user, organization, and organization role in parallel
 * Redirects to /sign-up if any required data is missing
 */
async function getPlatformAuthContextUncached(): Promise<PlatformAuthContext> {
  // 1. Get current user
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/sign-up');
  }

  const user = await UserService.getUser({ id: authUser.id });

  // 2. Redirect if no user
  if (!user) {
    redirect('/sign-up');
  }

  // 3. Validate organization invariants
  if (!user.organization_id) {
    console.error('[getPlatformAuthContext] User missing organization_id', {
      userId: user.id,
    });
    redirect('/sign-up');
  }

  // 4. Fetch organization and role in parallel
  const [organization, organizationRole] = await Promise.all([
    OrganizationService.getOrganization({ id: user.organization_id }).catch(
      (error) => {
        console.error('[getPlatformAuthContext] Failed to get organization', {
          userId: user.id,
          organizationId: user.organization_id,
          error,
        });
        return null;
      },
    ),
    PermissionService.getUserRoleForOrganization(
      user.id,
      user.organization_id,
    ).catch((error) => {
      console.error(
        '[getPlatformAuthContext] Failed to get organization role',
        {
          userId: user.id,
          organizationId: user.organization_id,
          error,
        },
      );
      return null;
    }),
  ]);

  // 5. Redirect if organization or role is missing
  if (!organization) {
    console.error('[getPlatformAuthContext] Organization not found', {
      userId: user.id,
      organizationId: user.organization_id,
    });
    redirect('/sign-up');
  }

  if (!organizationRole) {
    console.error('[getPlatformAuthContext] Organization role not found', {
      userId: user.id,
      organizationId: user.organization_id,
    });
    redirect('/sign-up');
  }

  // 6. Return complete context
  return {
    user,
    organization,
    organizationRole,
  };
}

/**
 * Get platform authentication context (user + organization + organization role)
 * Cached per-request to avoid duplicate database queries
 *
 * This function:
 * - Fetches the current user, their organization, and their organization role
 * - Performs parallel fetching for optimal performance
 * - Redirects to /sign-up if any required data is missing
 * - Uses React cache() for per-request deduplication
 */
export const getPlatformAuthContext = cache(getPlatformAuthContextUncached);
