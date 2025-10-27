'use client';

import { useMemo } from 'react';

import AppDataTable from '@openhome-os/particles/app-data-table';

import useLocationsQuery from '@/models/location/hooks/use-locations-query';

import { createLocationManagementColumns } from './system-location-management-utils';

const SystemLocationManagementTable = () => {
  const { data = [], isLoading } = useLocationsQuery({
    queryKey: ['system', 'locations'],
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
