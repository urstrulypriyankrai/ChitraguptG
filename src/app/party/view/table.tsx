"use client";
import React, { Suspense } from "react";
import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  //   SortingState,
  //   VisibilityState,
  //   createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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
import { Address, Party } from "@prisma/client";
import TableCellAction from "./TableCellAction";
type PartyWithRelations = Party & {
  address: Address | null;
};
const columns: ColumnDef<PartyWithRelations>[] = [
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
  {
    id: "action",
    header: "Actions",
    cell: (props) => (
      <Suspense>
        <TableCellAction {...props} />
      </Suspense>
    ),
  },
];

function NestedTable({ partyData }: { partyData: Address | null }) {
  // Replace with your actual nested table data fetching and rendering logic
  console.log(partyData, "from here");
  if (!partyData) return <div className="p-4">No address available</div>;

  // Define which fields to display (with labels)
  const addressFields = [
    { key: "village", label: "Village" },
    { key: "district", label: "District" },
    { key: "state", label: "State" },
    { key: "zip", label: "ZIP Code" },
    { key: "street", label: "Street" },
  ];

  return (
    <div className="p-4 w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addressFields.map(({ key, label }) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell>
                <>{partyData[key as keyof Address] || "N/A"}</>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function PartyTable({ DATA }: { DATA: PartyWithRelations[] }) {
  const [data] = useState<PartyWithRelations[]>(DATA);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
  // console.log(table.getRowModel().rows[0].original);
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
                    <NestedTable partyData={row.original.address} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
