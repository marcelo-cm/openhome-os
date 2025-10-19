'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import AppDataTable from '@/components/particles/app-data-table';

import { getLocations } from '@/models/location/location-actions';

import { createLocationManagementColumns } from './system-location-management-utils';

const SystemLocationManagementTable = () => {
  const { data: locations, isLoading } = useQuery({
    queryKey: ['system', 'locations'],
    queryFn: () => getLocations(),
    initialData: [],
  });
  const columns = useMemo(() => createLocationManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={locations}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default SystemLocationManagementTable;
