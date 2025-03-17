import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  partyName: z
    .string()
    .min(3, "kisaan ka nam bharo")
    .transform((val) => val.toUpperCase()),
  fathersName: z
    .string()
    .min(3, "Please enter farmer name")
    .transform((val) => val.toUpperCase()),
  partyType: z.enum(["SUPPLIER", "RETAILER"]),
  village: z.string().min(3, "village name required").optional(),
  street: z.string().min(2, "street name required").optional(),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  mobile: z.string().min(10).max(13, "mobile number should be of 10 digits"),
  zipCode: z.string().length(6, "Pincode 6 number ka hota h"),
  gstNumber: z.string().length(15, "Gst No 15 letter ka hota hai"),
});
