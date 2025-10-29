import { Suspense } from 'react';

import PlatformNavBar from './_components/platform-nav-bar';
import PlatformProviders from './_layers/_providers/platform-providers';

// Force dynamic rendering for all routes under this layout
// This is required because we access cookies() via getCurrentUser()
export const dynamic = 'force-dynamic';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-dvw" />}>
      <PlatformProviders>
        <main className="flex min-h-screen w-dvw flex-col items-center">
          <PlatformNavBar />

          <div className="flex w-full flex-row">{children}</div>
        </main>
      </PlatformProviders>
    </Suspense>
  );
};

export default PlatformLayout;
