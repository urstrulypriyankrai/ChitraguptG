export interface BillItem {
  productName: string;
  variantDetails: string;
  quantity: number;
  price: number;
  discount: number;
  gstRate: string;
  hsnCode: string;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  total: number;
}
