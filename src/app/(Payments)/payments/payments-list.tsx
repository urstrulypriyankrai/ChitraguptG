"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ChevronDown, Eye, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { Party, Payment } from "@prisma/client";
import { DateRange } from "react-day-picker";

interface PaymentsListProps {
  filter: "all" | "FARMER" | "RETAILER";
}

export default function PaymentsList({ filter }: PaymentsListProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Summary statistics
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalAmount: 0,
    averageAmount: 0,
  });

  useEffect(() => {
    async function fetchPayments() {
      setIsLoading(true);
      try {
        const fromDate = dateRange.from?.toISOString().split("T")[0];
        const toDate = dateRange.to?.toISOString().split("T")[0];

        const url = `/api/payments?startDate=${fromDate}&endDate=${toDate}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        let data = await response.json();

        // Filter by party type if needed
        if (filter !== "all") {
          data = data.filter(
            (payment: PaymentIncludePartyType) =>
              payment.party?.partyType === filter
          );
        }

        setPayments(data);

        // Calculate summary
        const totalAmount = data.reduce(
          (sum: number, p: { amount: number }) => sum + Number(p.amount),
          0
        );

        setSummary({
          totalPayments: data.length,
          totalAmount,
          averageAmount: data.length > 0 ? totalAmount / data.length : 0,
        });
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPayments();
  }, [filter, dateRange]);

  const columns: ColumnDef<Payment & { party: Party }>[] = [
    {
      accessorKey: "paymentDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString("en-IN");
      },
    },
    {
      accessorKey: "partyName",
      header: "Party Name",
      cell: ({ row }) => {
        const party = row.original.party;
        return party?.name || "N/A";
      },
    },
    {
      accessorKey: "party.partyType",
      header: "Party Type",
      cell: ({ row }) => {
        const party = row.original.party;
        return party?.partyType || "N/A";
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));
        return (
          <span className="text-green-600 font-medium">
            ₹{amount.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => {
        return `${row.original.description}` || "N/A";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              window.open(`/payments/${row.original.id}`, "_blank")
            }
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: payments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{summary.totalAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{summary.averageAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Filter by party name..."
            value={
              (table.getColumn("partyName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("partyName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <Input
            placeholder="Filter by reference..."
            value={
              (table.getColumn("reference")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("reference")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/payments/add")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Payment
          </Button>

          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange as Dispatch<SetStateAction<DateRange>>}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
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
                      data-state={row.getIsSelected() && "selected"}
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
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
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
        </>
      )}
    </div>
  );
}
type PaymentIncludePartyType = Payment & {
  party: Party;
};
