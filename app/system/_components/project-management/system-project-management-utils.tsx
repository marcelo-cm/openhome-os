import { ColumnDef } from '@tanstack/react-table';

import { TProject } from '@/models/project/project-types';

export const createProjectManagementColumns = (): ColumnDef<TProject>[] => {
  return [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => {
        return (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-muted-foreground text-xs">
              Org: {row.original.organization_id}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      accessorFn: (row: TProject) =>
        row.created_at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
    {
      header: 'Last Updated',
      accessorKey: 'updated_at',
      accessorFn: (row: TProject) =>
        row.updated_at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
  ];
};
