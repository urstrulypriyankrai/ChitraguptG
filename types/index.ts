// Extending your existing types

export interface Farmer {
  id: string;
  name: string;
  phone?: string;
  village: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string; // 'FERTILIZER' | 'INSECTICIDE' | 'PESTICIDE' | 'SEED'
  price: number;
  unit: string; // 'KG' | 'GRAM' | 'LITER' | 'ML' | 'PACKET'
  inventory?: Inventory;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  farmerId: string;
  farmer?: Farmer;
  date: Date;
  totalAmount: number;
  status: string; // 'PENDING' | 'COMPLETED' | 'CANCELLED'
  paymentStatus: string; // 'PAID' | 'PENDING' | 'PARTIAL'
  paymentMethod: string; // 'CASH' | 'CREDIT' | 'UPI' | 'BANK'
  items?: SaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}
