import { usePlatformAuthContext } from '@/app/(platform)/_layers/_providers/platform-context-provider';
import { PlatformAuthContext } from '@/app/(platform)/_layers/_providers/platform-context-types';

/**
 * Get the current authenticated user
 *
 * @returns {{ user: TUser }} The authenticated user (guaranteed non-null)
 */
export function useUser(): { user: PlatformAuthContext['user'] } {
  const { user } = usePlatformAuthContext();
  return { user };
}
