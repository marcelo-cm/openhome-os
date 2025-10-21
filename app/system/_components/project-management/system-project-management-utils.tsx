import { Fragment, useState } from 'react';

import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/ui/menu';

import { TProject } from '@/models/project/project-types';

import SystemProjectCreationDialog from './system-project-creation-dialog';

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
    {
      header: '',
      accessorKey: 'actions',
      cell: ({ row }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [open, setOpen] = useState(false);

        return (
          <Fragment>
            <Menu data-slot="project-management-actions">
              <MenuTrigger render={<Button variant="outline" size="icon-sm" />}>
                <EllipsisVerticalIcon />
              </MenuTrigger>
              <MenuPopup align="end">
                <MenuItem
                  data-slot="project-management-actions-edit"
                  title="Edit Project"
                  onClick={() => setOpen(true)}
                >
                  <PencilIcon />
                  Edit
                </MenuItem>
                <MenuItem
                  data-slot="project-management-actions-delete"
                  title="Delete Project"
                >
                  <TrashIcon />
                  Delete
                </MenuItem>
              </MenuPopup>
            </Menu>
            <SystemProjectCreationDialog
              open={open}
              onOpenChange={setOpen}
              project={row.original}
            />
          </Fragment>
        );
      },
    },
  ];
};
