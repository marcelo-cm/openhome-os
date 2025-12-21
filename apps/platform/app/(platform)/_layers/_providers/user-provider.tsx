'use client';

import { createContext, use, useMemo } from 'react';

import { TUser } from '@/models/user/user-types';

const UserContext = createContext<{
  promisedUser: Promise<TUser | null>;
}>({
  promisedUser: Promise.resolve(null),
});

export const UserContextProvider = ({
  children,
  promisedUser,
}: {
  children: React.ReactNode;
  promisedUser: Promise<TUser | null>;
}) => {
  const value = useMemo(() => ({ promisedUser }), [promisedUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = use(UserContext);
  const user = use(context.promisedUser);

  return {
    user,
  };
};
