import { z } from "zod";

export const partySchema = z.object({
  partyName: z
    .string()
    .min(2)
    .transform((val) => val.toUpperCase()),
  fathersName: z
    .string()
    .transform((val) => val.toUpperCase())
    .optional(),
  gstNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9A-Z]{15}$/.test(val), {
      message: "Invalid GST Number",
    }),
  email: z
    .string()
    .email("Invalid email format")
    .transform((val) => val.toUpperCase())
    .optional(),
  street: z.string().min(3, "Street must be at least 3 characters"),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  zipCode: z.string().length(6),
  partyType: z.string().min(2).max(10),
  mobile: z.string().min(10).max(13),
});
