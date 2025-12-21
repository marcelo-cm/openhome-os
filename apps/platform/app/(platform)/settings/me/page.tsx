'use client';

import { Suspense } from 'react';

import { useUser } from '../../_layers/_providers/user-provider';

const MePageContent = () => {
  const { user } = useUser();
  return <div>{user?.email}</div>;
};

const MePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MePageContent />
    </Suspense>
  );
};

export default MePage;
