import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { OrganizationTier } from '@/models/organization/organization-enums';
import { TOrganization } from '@/models/organization/organization-types';
import { titleCase } from '@/utils/text-formatting-utils';

export const createOrganizationManagementColumns =
  (): ColumnDef<TOrganization>[] => {
    return [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              {row.original.logo_url && (
                <img
                  src={row.original.logo_url}
                  alt={row.original.name}
                  className="size-8 rounded-md object-cover"
                />
              )}
              <p className="font-medium">{row.original.name}</p>
            </div>
          );
        },
      },
      {
        header: 'Tier',
        accessorKey: 'tier',
        cell(props) {
          const tier = props.row.original.tier;

          const colour =
            tier === OrganizationTier.ENTERPRISE
              ? 'bg-purple-500'
              : tier === OrganizationTier.PRO
                ? 'bg-blue-500'
                : 'bg-gray-500';

          return (
            <Badge variant="outline">
              <span
                className={cn(colour, 'size-1.5 rounded-full')}
                aria-hidden="true"
              />
              {titleCase(tier)}
            </Badge>
          );
        },
      },
      {
        header: 'Created',
        accessorKey: 'created_at',
        accessorFn: (row: TOrganization) =>
          row.created_at.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
      },
      {
        header: 'Last Updated',
        accessorKey: 'updated_at',
        accessorFn: (row: TOrganization) =>
          row.updated_at.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
      },
    ];
  };
