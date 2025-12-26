'use client';

import { Suspense } from 'react';

import { useUser } from '../../_layers/_providers/user-provider';

const MePageContent = () => {
  const { user } = useUser();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{user?.email}</h1>
        <p className="text-sm text-gray-500">
          {user?.first_name} {user?.last_name}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">User Details</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
};

const MePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MePageContent />
    </Suspense>
  );
};

export default MePage;
