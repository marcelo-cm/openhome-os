'use client';

import { createContext, useContext } from 'react';

import type { PlatformAuthContext } from '@/app/(platform)/_layers/_providers/platform-context-types';

const PlatformContext = createContext<PlatformAuthContext | null>(null);

interface PlatformContextProviderProps {
  platformAuthContext: PlatformAuthContext;
  children: React.ReactNode;
}

/**
 * PlatformContextProvider provides resolved platform authentication data to all client components
 *
 * This provider receives already-resolved data from the server (blocking SSR),
 * ensuring all components have immediate access to user, organization, and role.
 */
export function PlatformContextProvider({
  platformAuthContext,
  children,
}: PlatformContextProviderProps) {
  return (
    <PlatformContext.Provider value={platformAuthContext}>
      {children}
    </PlatformContext.Provider>
  );
}

/**
 * Get the complete platform authentication context
 * Includes user, organization, and organization role
 *
 * @throws {Error} If used outside of PlatformContextProvider
 * @returns {PlatformAuthContext} The complete platform auth context (guaranteed non-null)
 */
export function usePlatformAuthContext(): PlatformAuthContext {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error(
      'usePlatformAuthContext must be used within PlatformContextProvider',
    );
  }

  return context;
}
