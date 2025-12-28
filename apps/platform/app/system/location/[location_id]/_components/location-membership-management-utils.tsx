import { TLocationMembershipHydrated } from '@openhome-os/core/models/location/location-types';
import { Badge } from '@openhome-os/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { titleCase } from '@/utils/text-formatting-utils';

import { RbacRole } from '../../../../../../../packages/core/src/permissions/rbac-enums';

export const createLocationMembershipColumns =
  (): ColumnDef<TLocationMembershipHydrated>[] => {
    return [
      {
        header: 'User',
        accessorKey: 'user',
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <div>
              <p className="font-medium">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
            </div>
          );
        },
      },
      {
        header: 'Role',
        accessorKey: 'rbac_role',
        cell: ({ row }) => {
          const role = row.original.rbac_role;

          const colour =
            role === RbacRole.ADMIN ? 'bg-blue-500' : 'bg-gray-500';

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
        accessorFn: (row: TLocationMembershipHydrated) =>
          row.created_at.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
      },
    ];
  };
