"use client";
import TableCellAction from "./TableCellAction";
import { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/app/_components/DataTable";
import { ProductVariantType } from "@/lib/types/Product/ProductVariantType";
import { ProductType } from "@/lib/types/Product/product";
import { ProductSupplier } from "@prisma/client";
import { Edit } from "lucide-react";
import Link from "next/link";
import ProductVariant from "@/app/_components/product/productVariant/ProductVariant";
import { z } from "zod";

export type ProductsWithRelations = ProductType & {
  variants: ProductVariantType[];
  ProductSupplier: ProductSupplier[];
};
const columns: ColumnDef<ProductsWithRelations>[] = [
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "stock",
    header: "STOCK",
    cell: (props) => {
      const stocksFromVariants = props.row.original.variants.reduce(
        (acc, curr) => {
          return acc + curr.bags * curr.piecePerBag * curr.weight;
        },
        0
      );
      return stocksFromVariants;
    },
  },
  {
    accessorKey: "lowStockThreshold",
    header: "LOW ALERT",
  },
  {
    accessorKey: "taxHsnCode",
    header: "HSN CODE",
  },
  {
    id: "action",
    header: "ACTIONS",
    cell: (props) => (
      <Suspense fallback={<span>...</span>}>
        <TableCellAction {...props} />
      </Suspense>
    ),
  },
];

const renderAddressSubComponent = (row: ProductsWithRelations) => {
  if (!row.variants) return <div className="p-4">No variant available</div>;

  const columns: ColumnDef<ProductVariantType>[] = [
    {
      accessorKey: "bags",
      header: "Bags",
    },
    {
      accessorKey: "piecePerBag",
      header: "Piece / Bag",
    },
    {
      accessorKey: "weight",
      header: "Weight / Peice",
    },
    {
      accessorKey: "weightUnit",
      header: "Current Stock",
      cell: (props) => {
        return (
          <span>
            {props.row.original.bags *
              props.row.original.piecePerBag *
              props.row.original.weight}{" "}
            {props.row.original.quantityUnitName}
          </span>
        );
      },
    },

    {
      accessorKey: "unloading",
      header: "unloading",
    },
    {
      accessorKey: "freightCharges",
      header: "FrieghtCharges",
    },
    {
      accessorKey: "MRP",
      header: "MRP",
      cell: (props) => <>₹{props.cell.getValue()}</>,
    },
    {
      accessorKey: "warehouseLocation",
      header: "Location",
    },
    {
      id: "action",
      header: "Actions",
      cell: () => (
        <>
          <Link href={"/"}>
            <Edit></Edit>
          </Link>
        </>
      ),
    },
  ];

  return (
    <div className="p-4 w-full">
      <DataTable data={row.variants} columns={columns} />
    </div>
  );
};

export function ProductTable({ DATA }: { DATA: ProductsWithRelations[] }) {
  return (
    <DataTable
      columns={columns}
      data={DATA}
      renderSubComponent={renderAddressSubComponent}
      filterBy="name"
      searchPlaceholder="Filter Names..."
    />
  );
}
