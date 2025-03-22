import { GSTRATE } from "@prisma/client";

export interface SaleItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  discount: number;
  gstRate: GSTRATE;
  hsnCode: string;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  total: number;
}
