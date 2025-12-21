'use client';

import { useMemo } from 'react';

import AppDataTable from '@openhome-os/particles/app-data-table';

import useLocationMembershipsQuery from '@/models/location/hooks/use-location-memberships-query';

import { createLocationMembershipColumns } from './location-membership-management-utils';

interface LocationMembershipManagementTableProps {
  locationId: string;
}

const LocationMembershipManagementTable = ({
  locationId,
}: LocationMembershipManagementTableProps) => {
  const { data = [], isLoading } = useLocationMembershipsQuery({
    locationId,
    queryKey: ['location', 'memberships', locationId],
  });

  const columns = useMemo(() => createLocationMembershipColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={data}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default LocationMembershipManagementTable;
