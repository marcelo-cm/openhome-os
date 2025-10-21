'use client';

import { useMemo } from 'react';

import AppDataTable from '@/components/particles/app-data-table';

import useOrganizations from '@/models/organization/hooks/use-organizations';

import { createOrganizationManagementColumns } from './system-organization-management-utils';

const SystemOrganizationManagementTable = () => {
  const { data = [], isLoading } = useOrganizations({
    queryKey: ['system'],
  });
  const columns = useMemo(() => createOrganizationManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={data}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default SystemOrganizationManagementTable;
