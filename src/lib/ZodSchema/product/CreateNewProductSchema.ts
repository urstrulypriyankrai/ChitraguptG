import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name is required" })
    .transform((val) => val.toUpperCase()),
  supplier: z.object({
    value: z
      .string()
      .min(1, { message: "Supplier is required" })
      .transform((val) => val.toUpperCase()),
    id: z.string().transform((val) => val.toUpperCase()),
  }),
  description: z
    .string()
    .optional()
    .transform((val) => (val ? val.toUpperCase() : undefined)),
  lowStockThreshold: z
    .number()
    .min(0, { message: "Threshold cannot be negative" })
    .int(),
  category: z.string().min(1, "Category is required"),
  variants: z.array(
    z.object({
      // Match Prisma schema exactly
      bags: z.number(),
      piecePerBag: z.number(),
      weight: z.number(),
      MRP: z.number(),
      freightCharges: z.number(),
      unloading: z.number(),
      quantityUnitName: z.string(),
    })
  ),
  taxInformation: z.object({
    gstRate: z.string().min(1, { message: "GST Rate is required" }),

    hsnCode: z.string().min(1, { message: "HSN Code is required" }),
  }),
  inStock: z.number(),
});
