import { cache, use } from 'react';

import { getCurrentUser } from '@/models/user/user-actions';

import { UserContextProvider } from './user-provider';

const getCachedUser = cache(getCurrentUser);

const PlatformProviders = ({ children }: { children: React.ReactNode }) => {
  const user = use(getCachedUser());

  return <UserContextProvider user={user}>{children}</UserContextProvider>;
};

export default PlatformProviders;
