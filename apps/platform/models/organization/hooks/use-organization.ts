import { usePlatformAuthContext } from '@/app/(platform)/_layers/_providers/platform-context-provider';
import { PlatformAuthContext } from '@/app/(platform)/_layers/_providers/platform-context-types';

/**
 * Get the user's organization
 *
 * @returns {{ organization: TOrganization }} The organization (guaranteed non-null)
 */
export function useOrganization(): {
  organization: PlatformAuthContext['organization'];
} {
  const { organization } = usePlatformAuthContext();
  return { organization };
}
