import { z } from "zod";
export const farmerSchema = z.object({
  partyName: z
    .string()
    .min(3, "kisaan ka nam bharo")
    .transform((val) => val.toUpperCase()),
  fathersName: z
    .string()
    .min(3, "Please enter farmer name")
    .transform((val) => val.toUpperCase()),
  village: z.string().min(3, "village name required"),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  mobile: z.string().min(10).max(13, "mobile number should be of 10 digits"),
  zipCode: z.string().length(6, "Pincode 6 number ka hota h"),
  aadhar: z.string().length(12, "AADHAR NUMBER 12 DIGIT KA HOTA H"),
});

export type ErrorMsgObj = {
  partyName: string[];
  fathersName: string[];
  aadhar: string[];
  partyType: string[];
  gstNumber: string[];
  mobile: string[];
  street: string[];
  state: string[];
  email: string[];
  district: string[];
  zipCode: string[];
};
