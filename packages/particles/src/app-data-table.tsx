'use client';

import { Loader2 } from 'lucide-react';

import { Skeleton } from '@openhome-os/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@openhome-os/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  loadingVariant?: 'spinner' | 'skeleton';
}

function AppDataTable<TData, TValue>({
  columns,
  data,
  loading,
  loadingVariant,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          loadingVariant === 'spinner' ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <span className="flex h-full w-full items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              </TableCell>
            </TableRow>
          ) : (
            Array.from({
              length: table.getState().pagination.pageSize ?? 10,
            }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: columns.length }).map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default AppDataTable;
