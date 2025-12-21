import { Suspense } from 'react';

import PlatformNavBar from './_components/platform-nav-bar';
import PlatformProviders from './_layers/_providers/platform-providers';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PlatformProviders>
      <main className="flex min-h-screen w-dvw flex-col items-center">
        <Suspense fallback={<div className="h-16" />}>
          <PlatformNavBar />
        </Suspense>

        {children}
      </main>
    </PlatformProviders>
  );
};

export default PlatformLayout;
