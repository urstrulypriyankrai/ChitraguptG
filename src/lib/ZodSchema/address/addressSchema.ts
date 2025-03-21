import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().optional(),
  village: z.string().optional(),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
});
