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
  zipCode: string;
};

export type ErrorMsgObj = {
  partyName: string[];
  fathersName: string[];
  partyType: string[];
  gstNumber: string[];
  mobile: string[];
  street: string[];
  state: string[];
  email: string[];
  district: string[];
  zipCode: string[];
};
