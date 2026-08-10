import { useMemo } from 'react'
import {
  flexRender,
  useTable,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createPaginatedRowModel,
  sortFn_basic,
  sortFn_datetime,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

import { TableSkeleton } from '@/components/ui/loading'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const DataTable = ({
  tableKey,
  columns,
  data,
  loading = false,
  loadingRows = 5,
  loadingCols = 7,
  caption,
  enableSorting = true,
  enablePagination = true,
  pageSize = 10,
  emptyMessage = 'No records found.',
  ...options
}) => {
  const features = useMemo(
    () =>
      tableFeatures({
        ...(enableSorting
          ? {
              rowSortingFeature,
              sortedRowModel: createSortedRowModel(),
              sortFns: {
                basic: sortFn_basic,
                datetime: sortFn_datetime,
              },
            }
          : {}),
        ...(enablePagination
          ? {
              rowPaginationFeature,
              paginatedRowModel: createPaginatedRowModel(),
            }
          : {}),
      }),
    [enableSorting, enablePagination]
  )

  const table = useTable({
    ...(tableKey ? { key: tableKey } : {}),
    features,
    columns,
    data,
    initialState: enablePagination ? { pagination: { pageSize } } : undefined,
    ...options,
  })

  if (loading) {
    return (
      <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <TableSkeleton rows={loadingRows} columns={loadingCols} />
      </div>
    )
  }

  return (
    <div className='rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
      <Table>
        {caption && <TableCaption className='py-4'>{caption}</TableCaption>}
        <TableHeader>
            {/* getHeaderGroups = An array of Header cell objects that belong to this header group (row). */}
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
                {/* Map header array */}
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className='font-semibold'>
                  {header.isPlaceholder ? null : (
                    <button
                      type='button'
                      className={`flex items-center gap-1 select-none ${
                        enableSorting && header.column.getCanSort()
                          ? 'cursor-pointer hover:text-green-600 dark:hover:text-green-400'
                          : 'cursor-default'
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                      disabled={!enableSorting || !header.column.getCanSort()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {/* Arrows */}
                      {enableSorting && header.column.getCanSort() ? (
                        header.column.getIsSorted() === 'asc' ? (
                          <ArrowUp className='h-3.5 w-3.5' />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ArrowDown className='h-3.5 w-3.5' />
                        ) : (
                          <ChevronsUpDown className='h-3.5 w-3.5 opacity-50' />
                        )
                      ) : null}
                    </button>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getAllCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {enablePagination && table.getRowCount() > pageSize && (
        <div className='flex items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700 px-4 py-3'>
          <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300'>
            <span>Rows per page</span>
            <select
              value={table.state.pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm cursor-pointer'
            >
              {[10, 20, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300'>
            <span>
              Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className='rounded border border-gray-300 dark:border-gray-600 px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className='rounded border border-gray-300 dark:border-gray-600 px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable