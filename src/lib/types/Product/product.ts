import { GSTRATE } from "@prisma/client";
import { ProductVariantType } from "./ProductVariantType";

export type ProductVariantUnit = {
  quantity: number;
  quantityUnit: string;
  price: number;
  costPrice: number;
  sellingPrice: number;
  inStock: number;
  warehouseLocation: string;
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
