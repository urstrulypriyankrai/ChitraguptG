"use client";

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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Party } from "@prisma/client";

const columns = [
  {
    accessorKey: "partyType",
    header: "Party Type",
    cell: (props) => <TableCell>{props.getValue()}</TableCell>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (props) => <TableCell>{props.getValue()}</TableCell>,
  },
  {
    accessorKey: "id",
    header: "Aadhar / GST",
    cell: (props) => <TableCell>{props.getValue()}</TableCell>,
  },

  {
    accessorKey: "creditBalance",
    header: "Credit Balance",
    cell: (props) => <TableCell>{props.getValue()}</TableCell>,
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    cell: (props) => <TableCell>{props.getValue()}</TableCell>,
  },
];

// const columnHelper = createColumnHelper<Party>();

export default function PartyTable({ DATA }: { DATA: Party[] }) {
  const [data, setData] = useState<Party[]>(DATA);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log(table.getHeaderGroups());
  return (
    <>
      <Table className="w-full">
        <TableCaption>List of parties </TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id == "partyType" ? "w-[100px]" : ""}
                  >
                    {header.column.columnDef.header?.toString()}
                  </TableHead>
                ))}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
