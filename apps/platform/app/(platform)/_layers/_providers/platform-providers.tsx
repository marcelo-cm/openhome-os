import { getPlatformAuthContext } from '@/app/(platform)/_layers/_providers/platform-context-actions';

import { PlatformContextProvider } from './platform-context-provider';

/**
 * PlatformProviders loads and provides platform authentication context (blocking SSR)
 *
 * This server component:
 * - Fetches user, organization, and organization role (parallel)
 * - Blocks rendering until all data is loaded
 * - Redirects to /sign-up if any required data is missing
 * - Provides resolved (non-null) data to all child components via context
 */
const PlatformProviders = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const platformAuthContext = await getPlatformAuthContext();

  return (
    <PlatformContextProvider platformAuthContext={platformAuthContext}>
      {children}
    </PlatformContextProvider>
  );
};

export default PlatformProviders;
