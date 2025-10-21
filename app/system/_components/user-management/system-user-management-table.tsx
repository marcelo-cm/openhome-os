'use client';

import { useMemo } from 'react';

import AppDataTable from '@/components/particles/app-data-table';

import useUsers from '@/models/user/hooks/use-users';

import { createUserManagementColumns } from './system-user-management-utils';

const SystemUserManagementTable = () => {
  const { data = [], isLoading } = useUsers({
    queryKey: ['system'],
  });
  const columns = useMemo(() => createUserManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={data}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default SystemUserManagementTable;
