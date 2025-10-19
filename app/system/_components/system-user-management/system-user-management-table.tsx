'use client';

import { useMemo } from 'react';

import { ColumnDef } from '@tanstack/react-table';

import AppDataTable from '@/components/particles/app-data-table';

import { buildMany } from '@/models/base/base-utils';
import { buildFakeUser } from '@/models/user/user-factory';
import { TUser } from '@/models/user/user-types';

const SystemUserManagementTable = () => {
  const columns: ColumnDef<TUser>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => {
        return (
          <div>
            <p>
              {row.original.first_name} {row.original.last_name}
            </p>
            <p className="text-muted-foreground text-xs">
              {row.original.email}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Role',
      accessorKey: 'role',
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      accessorFn: (row: TUser) =>
        row.created_at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
    {
      header: 'Updated At',
      accessorKey: 'updated_at',
      accessorFn: (row: TUser) =>
        row.updated_at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
  ];
  const data = useMemo(() => {
    return buildMany(() => buildFakeUser(), 10);
  }, []);

  return <AppDataTable columns={columns} data={data} />;
};

export default SystemUserManagementTable;
