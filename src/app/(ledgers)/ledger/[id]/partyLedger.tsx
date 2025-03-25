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
import { DateRange } from "react-day-picker";
import PageHeading from "@/app/_components/PageHeading";

interface Ledger {
  id: number;
  partyId: string;
  amount: string;
  type: "DEBIT" | "CREDIT";
  date: string;
  description: string | null;
  referenceId: number | null;
  referenceType: string | null;
  transactionId: number | null;
  purchaseId: number | null;
  farmerSaleId: number | null;
  retailerSaleId: number | null;
  paymentId: number | null;
  createdAt: string;
  updatedAt: string;
  party: {
    id: string;
    name: string;
    partyType: string;
    mobile: string;
    creditBalance: number;
  };
}

interface PartyLedgerProps {
  filter: "all" | "CREDIT" | "DEBIT";
  id: string;
}

export function PartyLedger({ filter, id }: PartyLedgerProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [transactions, setTransactions] = useState<Ledger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setPartyName] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
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
        if (!dateRange?.from || !dateRange?.to) return;
        const fromDate = dateRange.from.toISOString();
        const toDate = dateRange.to.toISOString();

        // Fetch the ledger data
        const response = await fetch(
          `/api/ledger?partyId=${id}&startDate=${fromDate}&endDate=${toDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ledger data");
        }

        const data = await response.json();
        setTransactions(data);

        if (data.length > 0) {
          setPartyName(data[0].party.name);
        }

        // Calculate summary
        const totalCredit = data
          .filter((t: { type: string }) => t.type === "CREDIT")
          .reduce(
            (sum: number, t: { amount: string }) => sum + parseFloat(t.amount),
            0
          );

        const totalDebit = data
          .filter((t: { type: string }) => t.type === "DEBIT")
          .reduce(
            (sum: number, t: { amount: string }) => sum + parseFloat(t.amount),
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
  }, [id, filter, dateRange]);

  const columns: ColumnDef<Ledger>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return date.toLocaleDateString("en-IN");
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="max-w-[300px] truncate"
          title={row.getValue("description")}
        >
          {row.getValue("description") || "N/A"}
        </div>
      ),
    },
    {
      accessorFn: (row) => row.party.name,
      header: "Party Name",
      cell: ({ row }) => (
        <div
          className="max-w-[300px] truncate"
          title={row.getValue("description")}
        >
          {row.original.party.name || "N/A"}
        </div>
      ),
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
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
      cell: ({ row }) => row.getValue("referenceType") || "N/A",
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
        } else if (referenceType === "PURCHASE") {
          href = `/purchases/${referenceId}`;
        } else if (referenceType === "TRANSACTION") {
          href = `/transactions/${referenceId}`;
        }

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(href, "_blank")}
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
