import { z } from "zod";

export const unitSchema = z.object({
  name: z
    .string()
    .min(2, "Unit name must be at least 2 characters long")
    .max(50, "Unit name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Unit name can only contain letters and spaces")
    .trim(),
});
