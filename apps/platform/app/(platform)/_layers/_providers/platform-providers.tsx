import { cache } from 'react';

import { getCurrentUser } from '@/models/user/user-actions';

import { UserContextProvider } from './user-provider';

const getCachedUser = cache(getCurrentUser);

/**
 * PlatformProviders passes the user promise (not resolved) to avoid blocking navigation.
 * - Unwrapped in client component using use() hook.
 * - Unwrapped in server components using await hook.
 * This pattern is compatible with cacheComponents and allows non-blocking renders
 */
const PlatformProviders = ({ children }: { children: React.ReactNode }) => {
  const promisedUser = getCachedUser();

  return (
    <UserContextProvider promisedUser={promisedUser}>
      {children}
    </UserContextProvider>
  );
};

export default PlatformProviders;
