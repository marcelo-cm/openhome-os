'use client';

import { useMemo } from 'react';

import AppDataTable from '@/components/particles/app-data-table';

import useLocations from '@/models/location/hooks/use-locations';

import { createLocationManagementColumns } from './system-location-management-utils';

const SystemLocationManagementTable = () => {
  const { data = [], isLoading } = useLocations({
    queryKey: ['system'],
  });
  const columns = useMemo(() => createLocationManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={data}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default SystemLocationManagementTable;
