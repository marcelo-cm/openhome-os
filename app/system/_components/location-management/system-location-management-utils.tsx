import { Fragment, useState } from 'react';

import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/ui/menu';

import { TLocation } from '@/models/location/location-types';

import SystemLocationCreationDialog from './system-location-creation-dialog';

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
    {
      header: '',
      accessorKey: 'actions',
      cell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [open, setOpen] = useState(false);

        return (
          <Fragment>
            <Menu data-slot="location-management-actions">
              <MenuTrigger render={<Button variant="outline" size="icon-sm" />}>
                <EllipsisVerticalIcon />
              </MenuTrigger>
              <MenuPopup align="end">
                <MenuItem
                  data-slot="location-management-actions-edit"
                  title="Edit Location"
                  onClick={() => setOpen(true)}
                >
                  <PencilIcon />
                  Edit
                </MenuItem>
                <MenuItem
                  data-slot="location-management-actions-delete"
                  title="Delete Location"
                >
                  <TrashIcon />
                  Delete
                </MenuItem>
              </MenuPopup>
            </Menu>
            <SystemLocationCreationDialog
              open={open}
              onOpenChange={setOpen}
              location={row.original}
            />
          </Fragment>
        );
      },
    },
  ];
};
