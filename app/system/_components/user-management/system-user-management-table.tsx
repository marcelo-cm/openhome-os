'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import AppDataTable from '@/components/particles/app-data-table';

import { getUsers } from '@/models/user/user-actions';

import { createUserManagementColumns } from './system-user-management-utils';

const SystemUserManagementTable = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['system', 'users'],
    queryFn: () => getUsers(),
    initialData: [],
  });
  const columns = useMemo(() => createUserManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={users}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default SystemUserManagementTable;
