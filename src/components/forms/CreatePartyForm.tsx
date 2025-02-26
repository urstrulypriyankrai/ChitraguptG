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
import { useToast } from "@/hooks/use-toast";

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
  zipCode: "",
};

const formSchema = z.object({
  partyName: z.string().min(2),
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
  zipCode: z.string().length(6),
});

const CreatePartyForm = () => {
  const [errorMsg, setErrorMsg] = useState<ErrorMsgObj>({
    partyName: [],
    partyType: [],
    fathersName: [],
    gstNumber: [],
    mobile: [],
    street: [],
    state: [],
    email: [],
    district: [],
    zipCode: [],
  });
  const [formValue, setFormValue] = useState(initialFormValue);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);
      const parsedData = formSchema.safeParse(formValue);
      if (parsedData.success) {
        const res = await fetch("/api/party", {
          method: "POST",
          body: JSON.stringify({ ...formValue }),
        });
        if (res.status === 200) {
          let data = await res.json();
          data = JSON.parse(data.data);
          toast({
            variant: "default",
            title: "✅ Party Created Successfuly!",
            description: `Party Name: ${data.partyName}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "❌ Unable to create a party!",
            // description: `Party Name: ${data.message}`,
          });
        }
      } else {
        // if parseData.sucess = false
        const errors = parsedData.error.flatten();
        const fieldErrors = errors.fieldErrors;
        console.log(fieldErrors, "field errors from");
        const newErrorMsg: ErrorMsgObj = {
          partyName: fieldErrors.partyName || [],
          partyType: [],
          gstNumber: fieldErrors.gstNumber || [],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          mobile: fieldErrors.mobile || [],
          street: fieldErrors.street || [],
          state: fieldErrors.state || [],
          email: fieldErrors.email || [],
          district: fieldErrors.district || [],
          zipCode: fieldErrors.zipCode || [],
          fathersName: [],
        };
        setErrorMsg(newErrorMsg);
        console.log(fieldErrors);
      }
    } catch (error) {
      console.error("Validation Failed", error);
    } finally {
      setIsLoading(false);
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
      const errorsArray = data.error.flatten().formErrors;
      setErrorMsg({ ...errorMsg, mobile: errorsArray });
    } else {
      setErrorMsg({ ...errorMsg, mobile: [] });
    }
  }, [formValue.mobile]);

  // // 2. ERROR HANDLING FOR partyName
  // useEffect(() => {
  //   const data = z
  //     .string()
  //     .trim()
  //     .min(3, "Name must be at least 3 characters")
  //     .safeParse(formValue.partyName);

  //   if (!data.success) {
  //     let errorsArray = data.error?.flatten();
  //     errorsArray = errorsArray.fieldErrors;
  //     setErrorMsg({ ...errorMsg, partyName: errorsArray });
  //   } else {
  //     setErrorMsg({ ...errorMsg, partyName: [] });
  //   }
  // }, [formValue.partyName]);

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
      const errorsArray = data.error?.flatten().formErrors;
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

        <PartyFrom
          formValue={formValue}
          setFormValue={setFormValue}
          errorMsg={errorMsg}
        />
      </form>
      {formValue.partyType !== "FARMER" && (
        <Button
          onClick={handleSubmit}
          className="text-center mx-auto w-full mb-6 "
          disabled={isLoading}
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
        label="Enter Company Name"
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
        message={errorMsg.mobile}
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

      <AddressForm
        formValue={formValue}
        setFormValue={setFormValue}
        errorMsg={errorMsg}
      />
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
  const partyType = ["SUPPLIER", "RETAILER"];
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
