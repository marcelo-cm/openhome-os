import { usePlatformAuthContext } from '@/app/(platform)/_layers/_providers/platform-context-provider';
import { PlatformAuthContext } from '@/app/(platform)/_layers/_providers/platform-context-types';

/**
 * Get the user's role in their organization
 *
 * @returns {{ organizationRole: TOrganizationMembership }} The organization role (guaranteed non-null)
 */
export function useOrganizationRole(): {
  organizationRole: PlatformAuthContext['organizationRole'];
} {
  const { organizationRole } = usePlatformAuthContext();
  return { organizationRole };
}
