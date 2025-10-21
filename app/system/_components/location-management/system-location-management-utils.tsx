import { ColumnDef } from '@tanstack/react-table';

import { TLocation } from '@/models/location/location-types';

export const createLocationManagementColumns = (): ColumnDef<TLocation>[] => {
  return [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => {
        return (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-muted-foreground text-xs">
              Proj: {row.original.project_id}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      accessorFn: (row: TLocation) =>
        row.created_at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
    {
      header: 'Last Updated',
      accessorKey: 'updated_at',
      accessorFn: (row: TLocation) =>
        row.updated_at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
  ];
};
