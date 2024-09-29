'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface Message {
  id: number;
  timestamp: string;
  content: string;
  role: string;
  type: number;
  video_id: string;
  uid: number;
  created_at: string;
  updated_at: string;
  role_id: number;
  audio_len: number;
  txt_content: string;
  video_second: number;
  uemail: string;
}

export const columns: ColumnDef<Message>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'uemail',
    header: '用户邮箱',
    cell: ({ row }) => <div>{row.getValue('uemail')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          角色名称
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    accessorKey: 'content',
    header: '用户发送内容',
    cell: ({ row }) => (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className='max-w-[200px] line-clamp-1'
              title={row.getValue('content')}
            >
              {row.getValue('content')}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue('content')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: 'txt_content',
    header: 'AI 回复内容',
    cell: ({ row }) => (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className='max-w-[200px] line-clamp-1'
              title={row.getValue('content')}
            >
              {row.getValue('txt_content')}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue('txt_content')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: 'video_id',
    header: '视频Id / 网页URL',
    cell: ({ row }) => <div>{row.getValue('video_id')}</div>,
  },
  {
    accessorKey: 'video_second',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          播放时间
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('video_second')}</div>,
  },
  {
    accessorKey: 'type',
    header: '消息类型',
    cell: ({ row }) => (
      <div>{row.getValue('type') === 0 ? '用户询问' : 'AI主动发送'}</div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{formatDate(new Date(row.getValue('created_at')))}</div>
    ),
    filterFn: (row, columnId, filterValue: [Date, Date]) => {
      if (!filterValue || filterValue.length !== 2) return true;
      const [start, end] = filterValue;
      const cellValue = row.getValue(columnId) as string;
      const cellDate = new Date(cellValue);
      return cellDate >= start && cellDate <= end;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const message = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(message.id.toString())
              }
            >
              Copy message ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View message details</DropdownMenuItem>
            <DropdownMenuItem>Edit message</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function MessageList({ data }: { data: Message[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [emailFilter, setEmailFilter] = React.useState('');
  const [videoIdFilter, setVideoIdFilter] = React.useState('');
  const [contentFilter, setContentFilter] = React.useState('');
  const [txtContentFilter, setTxtContentFilter] = React.useState('');
  const [typeFilter] = React.useState<string | undefined>(undefined);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      fuzzy: (row, columnId, value) => {
        console.log(value);
        const rowValue = row.getValue(columnId) as string;
        return rowValue.toLowerCase().includes(value.toLowerCase());
      },
    },
  });

  React.useEffect(() => {
    table.getColumn('uemail')?.setFilterValue(emailFilter);
    table.getColumn('video_id')?.setFilterValue(videoIdFilter);
    table.getColumn('content')?.setFilterValue(contentFilter);
    table.getColumn('txt_content')?.setFilterValue(txtContentFilter);

    if (startDate && endDate) {
      table.getColumn('created_at')?.setFilterValue([startDate, endDate]);
    } else {
      table.getColumn('created_at')?.setFilterValue(undefined);
    }
  }, [
    table,
    emailFilter,
    videoIdFilter,
    contentFilter,
    txtContentFilter,
    typeFilter,
    startDate,
    endDate,
  ]);

  return (
    <div className='w-full'>
      <div className='flex items-center py-4 space-x-4 justify-between'>
        <div className='flex gap-2 flex-1'>
          <Input
            placeholder='Search by email...'
            value={emailFilter}
            onChange={(event) => setEmailFilter(event.target.value?.trim())}
            className='max-w-sm'
          />
          <Input
            placeholder='Search by video ID...'
            value={videoIdFilter}
            onChange={(event) => setVideoIdFilter(event.target.value?.trim())}
            className='max-w-sm'
          />
          <Input
            placeholder='Search in content...'
            value={contentFilter}
            onChange={(event) => setContentFilter(event.target.value?.trim())}
            className='max-w-sm'
          />
          <Input
            placeholder='Search in txt_content...'
            value={txtContentFilter}
            onChange={(event) =>
              setTxtContentFilter(event.target.value?.trim())
            }
            className='max-w-sm'
          />
          <div className='flex items-center space-x-2'>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeIntervals={60}
              timeCaption='Time'
              dateFormat='MMMM d, yyyy h:mm aa'
              placeholderText='Start Date'
              className='border p-2 rounded'
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              showTimeSelect
              timeIntervals={60}
              timeCaption='Time'
              dateFormat='MMMM d, yyyy h:mm aa'
              placeholderText='End Date'
              className='border p-2 rounded'
            />
          </div>
        </div>
        {/* <Select
          value={typeFilter}
          onValueChange={(value) =>
            setTypeFilter(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value={0}>User</SelectItem>
            <SelectItem value={1}>AI</SelectItem>
          </SelectContent>
        </Select> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
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
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
