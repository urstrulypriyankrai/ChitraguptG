import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Edit } from "lucide-react";

import React from "react";
import { CellContext } from "@tanstack/react-table";
import Link from "next/link";
import { ProductsWithRelations } from "./table";

export default function TableCellAction(
  props: CellContext<ProductsWithRelations, unknown>
) {
  return (
    <div className=" flex justify-start items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => props.row.toggleExpanded()}
      >
        {props.row.getIsExpanded() ? <ArrowUp /> : <ArrowDown />}
      </Button>
      <Button variant="ghost" size="icon">
        <Link href={""} target="_blank">
          <Edit />
        </Link>
      </Button>
    </div>
  );
}
