'use client';

import { useMemo } from 'react';

import useUsers from '@openhome-os/core/models/user/hooks/use-users';
import AppDataTable from '@openhome-os/particles/app-data-table';

import { createUserManagementColumns } from './system-user-management-utils';

const SystemUserManagementTable = () => {
  const { data, isLoading, isPending, isFetched } = useUsers({
    queryKey: ['system', 'users'],
  });
  const columns = useMemo(() => createUserManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={data}
      loading={isLoading || isPending || !isFetched}
      loadingVariant="skeleton"
    />
  );
};

export default SystemUserManagementTable;
