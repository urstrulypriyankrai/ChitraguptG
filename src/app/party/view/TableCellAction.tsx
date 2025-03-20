import { Button } from "@/components/ui/button";
import { Address, Party } from "@prisma/client";

import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import React from "react";
import { CellContext } from "@tanstack/react-table";
import Link from "next/link";
type PartyWithRelations = Party & {
  address: Address | null;
};
export default function TableCellAction(
  props: CellContext<PartyWithRelations, unknown>
) {
  return (
    <React.Fragment>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => props.row.toggleExpanded()}
      >
        {props.row.getIsExpanded() ? <ArrowUp /> : <ArrowDown />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-center">Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link
              href={`/party/UPDATE/${props.row.original.id}`}
              target="_blank"
            >
              {props.row.original.partyType === "FARMER"
                ? "Edit Customer Details"
                : "Edit Party Details"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href={`/address/${props.row.original.address?.id}`}
              target="_blank"
            >
              {props.row.original.partyType === "FARMER"
                ? "Edit Customer Address"
                : "Edit Party Address"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>View Customer Ledger</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </React.Fragment>
  );
}
