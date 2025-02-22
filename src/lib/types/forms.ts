import { ZodIssue } from "zod";

export type FormObjectType = {
  fathersName: string;
  partyName: string;
  partyType: string;
  gstNumber: string;
  mobile: string;
  email: string;
  street: string;
  state: string;
  district: string;
};

export type ErrorMsgObj = {
  partyName: ZodIssue[];
  fathersName: ZodIssue[];
  partyType: ZodIssue[];
  gstNumber: ZodIssue[];
  mobile: ZodIssue[];
  street: ZodIssue[];
  state: ZodIssue[];
  email: ZodIssue[];
  district: ZodIssue[];
};
