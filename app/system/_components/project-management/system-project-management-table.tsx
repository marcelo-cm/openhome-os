'use client';

import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import AppDataTable from '@/components/particles/app-data-table';

import { getProjects } from '@/models/project/project-actions';

import { createProjectManagementColumns } from './system-project-management-utils';

const SystemProjectManagementTable = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['system', 'projects'],
    queryFn: () => getProjects(),
    initialData: [],
  });
  const columns = useMemo(() => createProjectManagementColumns(), []);

  return (
    <AppDataTable
      columns={columns}
      data={projects}
      loading={isLoading}
      loadingVariant="skeleton"
    />
  );
};

export default SystemProjectManagementTable;
