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

export interface ReceiptData {
  paymentId: number;
  paymentDate: string;
  amount: number;
  reference?: string;
  party: {
    name: string;
    partyType: string;
    mobile: string;
    address?: {
      street?: string;
      village?: string;
      district: string;
      state: string;
      zip: string;
    };
  };
}
