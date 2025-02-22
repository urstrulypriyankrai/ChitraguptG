"use client";
import AddressForm from "@/components/forms/addressForm";
import { LabeledInput } from "@/components/ui/LabledInput";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { FormEvent, SetStateAction, useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { FormObjectType, ErrorMsgObj } from "@/lib/types/forms";
import CreateNewFarmer from "./CreateNewFarmer";

const initialFormValue = {
  partyName: "",
  partyType: "SUPPLIER",
  fathersName: "",
  gstNumber: "",
  mobile: "",
  email: "",
  street: "",
  state: "",
  district: "",
};

const formSchema = z.object({
  fathersName: z.string().optional(),
  gstNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9A-Z]{15}$/.test(val), {
      message: "Invalid GST Number",
    }),

  email: z.string().email("Invalid email format"),
  street: z.string().min(3, "Street must be at least 3 characters"),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
});
const CreatePartyForm = () => {
  const [errorMsg, setErrorMsg] = useState<ErrorMsgObj>({
    partyName: [],
    fathersName: [],
    partyType: [],
    gstNumber: [],
    mobile: [],
    street: [],
    state: [],
    email: [],
    district: [],
  });
  const [formValue, setFormValue] = useState(initialFormValue);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const parsedData = formSchema.safeParse(formValue);
      console.log("Parsed Form Data", parsedData.error?.errors);
      console.log("street", formValue);
    } catch (error) {
      console.error("Validation Failed", error);
    }
  }

  // start effects
  // 1. ERROR HANDLING FOR mobile
  useEffect(() => {
    const data = z
      .string()
      .min(10, "Invalid mobile number")
      .max(13, "Invalid mobile number")
      .safeParse(formValue.mobile);

    if (!data.success) {
      const errorsArray = data.error.errors;
      setErrorMsg({ ...errorMsg, mobile: errorsArray });
    } else {
      setErrorMsg({ ...errorMsg, mobile: [] });
    }
  }, [formValue.mobile]);

  // 2. ERROR HANDLING FOR partyName
  useEffect(() => {
    const data = z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .safeParse(formValue.partyName);

    if (!data.success) {
      const errorsArray = data.error?.errors;
      setErrorMsg({ ...errorMsg, partyName: errorsArray });
    } else {
      setErrorMsg({ ...errorMsg, partyName: [] });
    }
  }, [formValue.partyName]);

  // 3. ERROR HANDLING FOR gstNumber
  useEffect(() => {
    const data = z
      .string()
      .optional()
      .refine((val) => !val || /^[0-9A-Z]{15}$/.test(val), {
        message: "Invalid GST Number",
      })
      .safeParse(formValue.gstNumber);

    if (!data.success) {
      const errorsArray = data.error?.errors;
      setErrorMsg({ ...errorMsg, gstNumber: errorsArray });
    } else {
      setErrorMsg({ ...errorMsg, gstNumber: [] });
    }
  }, [formValue.gstNumber]);

  // eof effects

  return (
    <div className="md:w-[60vw] w-[90vw] mx-auto">
      <form className="space-y-6 mb-6">
        <PartyType setFormValue={setFormValue} name="partyType" />
        {formValue.partyType != "FARMER" ? (
          <PartyFrom
            formValue={formValue}
            setFormValue={setFormValue}
            errorMsg={errorMsg}
          />
        ) : (
          <CreateNewFarmer />
        )}
      </form>
      {formValue.partyType !== "FARMER" && (
        <Button
          onClick={handleSubmit}
          className="text-center mx-auto w-full mb-6 "
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default CreatePartyForm;

const PartyFrom = ({
  formValue,
  setFormValue,
  errorMsg,
}: {
  formValue: FormObjectType;
  setFormValue: (formValue: FormObjectType) => void;
  errorMsg: ErrorMsgObj;
}) => {
  return (
    <>
      <LabeledInput
        name="PartyName"
        label="Enter Name"
        required
        message={errorMsg?.partyName}
        onChange={(e) =>
          setFormValue({ ...formValue, partyName: e.target.value })
        }
      />
      <LabeledInput
        name="gstNumber"
        label="Enter GSTIN"
        // required={formValue.partyType != "FARMER" ? true : false}
        hidden={formValue.partyType !== "FARMER" ? false : true}
        message={errorMsg?.gstNumber}
        onChange={(e) =>
          setFormValue({
            ...formValue,
            gstNumber: e.target.value,
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
        onChange={(e) => setFormValue({ ...formValue, mobile: e.target.value })}
      />
      <LabeledInput
        name="email"
        label="Enter Email address"
        required={formValue.partyType != "FARMER"}
        hidden={formValue.partyType === "FARMER"}
        type="mail"
        message={errorMsg?.email}
        onChange={(e) => setFormValue({ ...formValue, email: e.target.value })}
      />

      <AddressForm formValue={formValue} setFormValue={setFormValue} />
    </>
  );
};

//========= Radio Group for Party type
const PartyType = ({
  setFormValue,
  name,
  ...props
}: {
  setFormValue: React.Dispatch<SetStateAction<FormObjectType>>;
  name: string;
}) => {
  const partyType = ["SUPPLIER", "RETAILER", "FARMER"];
  return (
    <RadioGroup
      name={name}
      defaultValue="SUPPLIER"
      required
      className="flex flex-row w-full space-x-6 [&>*]:text-2xl justify-center my-6"
      onValueChange={(e: string) =>
        setFormValue((prev) => ({ ...prev, partyType: e }))
      }
      {...props}
    >
      {partyType.map((type) => (
        <div key={type} className="flex items-center space-x-2">
          <RadioGroupItem value={type} id={type} />
          <Label htmlFor={type}>{type}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};
