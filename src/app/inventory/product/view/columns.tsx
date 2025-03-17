"use client";

import { ProductVariantType } from "@/lib/types/Product/ProductVariantType";
import { GSTRATE } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export type ProductType = {
  id: string;
  name: string;
  description: string | null;
  inStock: number | null;
  lowStockThreshold: number;
  taxHsnCode: string;
  productCategoryName: string;
  category: { name: string };
  tax: { hsnCode: string; gstRate: GSTRATE };
  variants: ProductVariantType[];
  productSupplier: unknown;
};
export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "ToggleButton",
    header: "",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "inStock",
    header: "In Stock",
  },
  {
    accessorKey: "lowStockThreshold",
    header: "Low Stock Threshold",
  },
];
