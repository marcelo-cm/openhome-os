'use client';

import { useMemo } from 'react';

import useProjects from '@openhome-os/core/models/project/hooks/use-projects-query';
import AppDataTable from '@openhome-os/particles/app-data-table';

import { createProjectManagementColumns } from './system-project-management-utils';

const SystemProjectManagementTable = () => {
  const { data, isLoading, isPending, isFetched } = useProjects({
    queryKey: ['system', 'projects'],
  });
  const columns = useMemo(() => createProjectManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={data}
      loading={isLoading || isPending || !isFetched}
      loadingVariant="skeleton"
    />
  );
};

export default SystemProjectManagementTable;
