"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Party } from "@prisma/client";

const columns = [
  {
    id: "expand",
    header: "Expand",
    cell: ExpandClose,
  },
  {
    accessorKey: "partyType",
    header: "Party Type",
    cell: (props) => <>{props?.getValue()}</>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (props) => <>{props.getValue()}</>,
  },
  {
    accessorKey: "id",
    header: "Aadhar / GST",
    cell: (props) => <>{props.getValue()}</>,
  },
  {
    accessorKey: "creditBalance",
    header: "Credit Balance",
    cell: (props) => <>{props.getValue()}</>,
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: (props) => <>{props.getValue()}</>,
  },
];

function NestedTable({ partyId }: { partyId: string }) {
  // Replace with your actual nested table data fetching and rendering logic
  return (
    <div className="p-4 w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nested Header 1</TableHead>
            <TableHead>Nested Header 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data for {partyId} - 1</TableCell>
            <TableCell>Data for {partyId} - 2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Data for {partyId} - 3</TableCell>
            <TableCell>Data for {partyId} - 4</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default function PartyTable({ DATA }: { DATA: Party }) {
  const [data, setData] = useState<Party>(DATA);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>();
  const [expandedRows, setExpandedRows] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpandedRows,
    state: {
      columnFilters,
      expanded: expandedRows,
    },
  });

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
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
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {row.getIsExpanded() && (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <NestedTable partyId={row.original.id} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

function ExpandClose({ row }) {
  return (
    <Button variant="ghost" size="icon" onClick={() => row.toggleExpanded()}>
      {row.getIsExpanded() ? <ArrowUp /> : <ArrowDown />}
    </Button>
  );
}
