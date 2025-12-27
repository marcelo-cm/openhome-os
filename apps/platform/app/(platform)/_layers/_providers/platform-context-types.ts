import type {
  TOrganization,
  TOrganizationMembership,
} from '@/models/organization/organization-types';

import type { TUser } from '../../../../models/user/user-types';

/**
 * Platform authentication context - guaranteed to be present for all routes under /(platform)
 * This represents the complete auth state required for the platform to render.
 */
export interface PlatformAuthContext {
  /**
   * The authenticated user
   * Non-null: guaranteed by redirect if missing
   */
  user: TUser;

  /**
   * The user's organization
   * Non-null: guaranteed by redirect if missing
   */
  organization: TOrganization;

  /**
   * The user's role/membership in their organization
   * Non-null: guaranteed by redirect if missing
   */
  organizationRole: TOrganizationMembership;
}
