export type ProductVariantType = {
  id?: string;
  bags: number;
  piecePerBag: number;
  weight: number;
  MRP: number;
  unloading: number;
  freightCharges: number;
  inStock: number | null;
  warehouseLocation?: string | null;
  quantityUnitName: string;
  weightUnit?: { name: string };
};
