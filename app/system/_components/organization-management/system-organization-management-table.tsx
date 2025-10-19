'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import AppDataTable from '@/components/particles/app-data-table';

import { getOrganizations } from '@/models/organization/organization-actions';

import { createOrganizationManagementColumns } from './system-organization-management-utils';

const SystemOrganizationManagementTable = () => {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['system', 'organizations'],
    queryFn: () => getOrganizations(),
    initialData: [],
  });
  const columns = useMemo(() => createOrganizationManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={organizations}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default SystemOrganizationManagementTable;
