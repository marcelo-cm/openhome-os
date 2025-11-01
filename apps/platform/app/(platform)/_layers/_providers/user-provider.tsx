'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';

import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/models/user/user-actions';
import { TUser } from '@/models/user/user-types';

const UserContext = createContext<{
  user: TUser | null;
  refreshing: boolean;
  refresh: () => void;
}>({
  user: null,
  refreshing: false,
  refresh: () => {},
});

export const UserContextProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: TUser | null;
}) => {
  const [currentUser, setCurrentUser] = useState<TUser | null>(user);

  const [refreshing, startTransition] = useTransition();
  const supabase = useMemo(() => createClient(), []);

  const refresh = () =>
    startTransition(async () => {
      const fresh = await getCurrentUser();
      setCurrentUser(fresh);
    });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refresh(); // SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED / USER_UPDATED
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo(
    () => ({ user: currentUser, refreshing, refresh }),
    [currentUser, refreshing],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};
