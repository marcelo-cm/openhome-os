import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { UserRole } from '@/models/user/user-enums';
import { TUser } from '@/models/user/user-types';
import { titleCase } from '@/utils/text-formatting-utils';

export const createUserManagementColumns = (): ColumnDef<TUser>[] => {
  return [
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
      cell(props) {
        const role = props.row.original.role;

        const colour = role === UserRole.ADMIN ? 'bg-blue-500' : 'bg-gray-500';

        return (
          <Badge variant="outline">
            <span
              className={cn(colour, 'size-1.5 rounded-full')}
              aria-hidden="true"
            />
            {titleCase(role)}
          </Badge>
        );
      },
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      accessorFn: (row: TUser) =>
        row.created_at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
    {
      header: 'Last Updated',
      accessorKey: 'updated_at',
      accessorFn: (row: TUser) =>
        row.updated_at.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    },
  ];
};
