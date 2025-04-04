"use client";

import { useState, useEffect, SetStateAction, Dispatch } from "react";
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
import { ArrowUpDown, ChevronDown, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { Ledger, Party } from "@prisma/client";

interface UniversalLedgerProps {
  filter: "all" | "CREDIT" | "DEBIT";
}

export default function UniversalLedger({ filter }: UniversalLedgerProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Summary statistics
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
  });

  useEffect(() => {
    async function fetchLedger() {
      setIsLoading(true);
      try {
        if (!dateRange?.from || !dateRange?.to) {
          // Check if both from and to exist
          return;
        }

        const fromDate = format(startOfDay(dateRange?.from), "yyyy-MM-dd");
        const toDate = format(endOfDay(dateRange?.to), "yyyy-MM-dd");
        if (!fromDate || !toDate) return;
        let url = `/api/ledger?startDate=${fromDate}&endDate=${toDate}`;
        if (filter !== "all") {
          url += `&type=${filter}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch ledger data");
        }

        const data = await response.json();
        setTransactions(data);

        // Calculate summary
        const totalCredit = data
          .filter((t: { type: string }) => t.type === "CREDIT")
          .reduce(
            (sum: number, t: { amount: string }) => sum + parseInt(t.amount),
            0
          );

        const totalDebit = data
          .filter((t: { type: string }) => t.type === "DEBIT")
          .reduce(
            (sum: number, t: { amount: string }) => sum + parseInt(t.amount),
            0
          );

        setSummary({
          totalTransactions: data.length,
          totalCredit,
          totalDebit,
          balance: totalCredit - totalDebit,
        });
      } catch (error) {
        console.error("Error fetching ledger data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLedger();
  }, [filter, dateRange]);

  useEffect(() => {});
  const columns: ColumnDef<
    Ledger & {
      party: Party;
    }
  >[] = [
    {
      accessorKey: "date",
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
        const date = new Date(row.getValue("date"));
        return date.toLocaleDateString("en-IN");
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return (
          <div
            className="max-w-[300px] truncate"
            title={row.getValue("description")}
          >
            {row.getValue("description")}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.party?.name,
      header: "Party Name",
      cell: ({ row }) => {
        const party = row.original.party;
        return (
          <Button
            variant={"ghost"}
            onClick={() =>
              window.open(`/ledger/${row.original.partyId}`, "_blank")
            }
          >
            {party?.name || "N/A"}
          </Button>
        );
      },
    },
    {
      accessorKey: "partyType",
      header: "Party Type",
      cell: ({ row }) => {
        const party = row.original.party;
        return party?.partyType || "N/A";
      },
    },
    {
      accessorKey: "Total Balance",
      header: "Total Balance",
      cell: ({ row }) => {
        return row.original.party.creditBalance;
      },
    },

    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              type === "CREDIT"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {type}
          </span>
        );
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
        const type = row.getValue("type") as string;

        return (
          <span
            className={
              type === "CREDIT"
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            ₹{amount.toFixed(2)}
          </span>
        );
      },
    },
    {
      accessorKey: "referenceType",
      header: "Reference",
      cell: ({ row }) => {
        return row.getValue("referenceType") || "N/A";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const referenceType = row.original.referenceType;
        const referenceId = row.original.referenceId;

        if (!referenceId) return null;

        let href = "#";
        if (
          referenceType === "FARMER_SALE" ||
          referenceType === "RETAILER_SALE"
        ) {
          href = `/sales/bill/${referenceId}`;
        } else if (referenceType === "PAYMENT") {
          href = `/payments/${referenceId}`;
        } else if (referenceType === "RETURN") {
          href = `/returns/${referenceId}`;
        }

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transactions,
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalTransactions.toFixed()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{Number(summary.totalCredit).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Debits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{Number(summary.totalDebit).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summary.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{Number(summary.balance).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* <Input
            placeholder="Filter by description..."
            value={
              (table.getColumn("description")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          /> */}

          <Input
            placeholder="Filter by party name..."
            value={
              (table.getColumn("Party Name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("Party Name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <DateRangePicker
            date={dateRange}
            onDateChange={
              setDateRange as Dispatch<SetStateAction<DateRange | undefined>>
            }
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
