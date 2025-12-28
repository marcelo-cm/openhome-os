'use client';

import { useMemo } from 'react';

import useLocationsQuery from '@openhome-os/core/models/location/hooks/use-locations-query';
import AppDataTable from '@openhome-os/particles/app-data-table';

import { createLocationManagementColumns } from './system-location-management-utils';

const SystemLocationManagementTable = () => {
  const { data, isLoading, isPending, isFetched } = useLocationsQuery({
    queryKey: ['system', 'locations'],
  });
  const columns = useMemo(() => createLocationManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={data}
      loading={isLoading || isPending || !isFetched}
      loadingVariant="skeleton"
    />
  );
};

export default SystemLocationManagementTable;
