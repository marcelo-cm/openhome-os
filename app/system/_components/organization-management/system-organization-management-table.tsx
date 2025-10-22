'use client';

import { useMemo } from 'react';

import AppDataTable from '@/components/particles/app-data-table';

import useOrganizationsQuery from '@/models/organization/hooks/use-organizations-query';

import { createOrganizationManagementColumns } from './system-organization-management-utils';

const SystemOrganizationManagementTable = () => {
  const { data = [], isLoading } = useOrganizationsQuery({
    queryKey: ['system', ' organizations'],
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
