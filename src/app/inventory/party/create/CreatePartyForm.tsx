"use client";
import AddressForm from "@/components/forms/addressForm";
import { LabeledInput } from "@/components/ui/LabledInput";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { SetStateAction, useEffect } from "react";
import { useState } from "react";

const CreatePartyForm = () => {
  const onSumbmit = (formData: FormData) => {
    console.log(formData);
  };

  const [errorMsg, setErrorMsg] = useState({
    partyName: "",
    partyType: "",
    gstNumber: "",
    mobile: "",
    street: "",
    state: "",
    email: "",
    district: "",
  });
  const [formValue, setFormValue] = useState({
    partyName: "",
    partyType: "SUPPLIER",
    gstNumber: "",
    mobile: "",
    email: "",
    street: "",
    state: "",
    district: "",
  });

  useEffect(() => {
    return () =>
      setErrorMsg({
        partyName: "",
        partyType: "",
        gstNumber: "",
        mobile: "",
        email: "",
        street: "",
        state: "",
        district: "",
      });
  }, []);
  return (
    <div className="md:w-[60vw] w-[90vw] mx-auto">
      <form action={onSumbmit} className="space-y-6">
        <PartyType setFormValue={setFormValue} formValue={formValue} />
        <LabeledInput
          name="PartyName"
          label="Enter Name"
          required
          message={errorMsg?.partyName}
          onChange={(e) =>
            setFormValue(() => {
              return { ...formValue, partyName: e.target.value };
            })
          }
        />

        <LabeledInput
          name="gstNumber"
          label="Enter GSTIN"
          // required={formValue.partyType != "FARMER" ? true : false}
          hidden={formValue.partyType !== "FARMER" ? false : true}
          message={errorMsg?.gstNumber}
          onChange={(e) =>
            setFormValue(() => {
              return { ...formValue, gstNumber: e.target.value };
            })
          }
        />
        <LabeledInput
          name="mobile"
          label="Enter Contact Number"
          required
          type="number"
          message={errorMsg?.mobile}
          maxLength={13}
          minLength={10}
          onChange={(e) =>
            setFormValue(() => {
              return { ...formValue, mobile: e.target.value };
            })
          }
        />
        <LabeledInput
          name="email"
          label="Enter Email address"
          required
          type="mail"
          message={errorMsg?.email}
          onChange={(e) =>
            setFormValue(() => {
              return { ...formValue, email: e.target.value };
            })
          }
        />
        <AddressForm formValue={formValue} setFormValue={setFormValue} />
      </form>
    </div>
  );
};

export default CreatePartyForm;

//========= Radio Group for Party type
const PartyType = ({
  setFormValue,
  formValue,
  ...props
}: {
  setFormValue: React.Dispatch<SetStateAction<FormObjectType>>;
  formValue: FormObjectType;
}) => {
  return (
    <RadioGroup
      defaultValue="SUPPLIER"
      required
      className="flex flex-row w-full space-x-6 [&>*]:text-2xl justify-center my-6  "
      {...props}
      onValueChange={(e: string) => {
        setFormValue({ ...formValue, partyType: e });
      }}
    >
      <div className="flex items-center space-x-2 ">
        <RadioGroupItem value="SUPPLIER" id="SUPPLIER" />
        <Label htmlFor="SUPPLIER">SUPPLIER</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="RETAILER" id="RETAILER" />
        <Label htmlFor="RETAILER">RETAILER</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="FARMER" id="FARMER" />
        <Label htmlFor="FARMER">FARMER</Label>
      </div>
    </RadioGroup>
  );
};

export type FormObjectType = {
  fatherName?: string;
  partyName: string;
  partyType: string;
  gstNumber: string;
  mobile: string;
  email: string;
  street: string;
  state: string;
  district: string;
};
