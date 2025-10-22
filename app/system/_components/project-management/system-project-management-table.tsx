'use client';

import { useMemo } from 'react';

import AppDataTable from '@/components/particles/app-data-table';

import useProjects from '@/models/project/hooks/use-projects-query';

import { createProjectManagementColumns } from './system-project-management-utils';

const SystemProjectManagementTable = () => {
  const { data = [], isLoading } = useProjects({
    queryKey: ['system', 'projects'],
  });
  const columns = useMemo(() => createProjectManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={data}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default SystemProjectManagementTable;
