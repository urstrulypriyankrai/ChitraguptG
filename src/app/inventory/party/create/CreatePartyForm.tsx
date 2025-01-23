"use client";
import AddressForm from "@/components/forms/addressForm";
import { LabeledInput } from "@/components/ui/LabledInput";
import React from "react";
import { useState } from "react";

const CreatePartyForm = () => {
  const onSumbmit = (formData: FormData) => {
    console.log(formData);
  };

  const [errorMsg] = useState({
    PartyName: "",
  });
  const [formValue, setFormValue] = useState({
    partyName: "",
    type: "",
    gstNumber: "",
    contactNumber: "",
    address: "",
  });

  return (
    <div className="md:w-[60vw] w-[90vw] mx-auto">
      <form action={onSumbmit} className="space-y-6 ">
        <LabeledInput
          name="PartyName"
          label="Enter Name"
          required
          message={errorMsg?.PartyName}
          onChange={(e) =>
            setFormValue(() => {
              return { ...formValue, partyName: e.target.value };
            })
          }
        />

        <LabeledInput
          name="gstNumber"
          label="Enter GSTIN"
          required
          message={errorMsg?.PartyName}
          onChange={(e) =>
            setFormValue(() => {
              return { ...formValue, address: e.target.value };
            })
          }
        />
        <LabeledInput
          name="contactNumber"
          label="Enter Contact Number"
          required
          type="number"
          message={errorMsg?.PartyName}
          maxLength={13}
          minLength={10}
          onChange={(e) =>
            setFormValue(() => {
              return { ...formValue, contactNumber: e.target.value };
            })
          }
        />
        <LabeledInput
          name="contactNumber"
          label="Enter Email address"
          required
          type="number"
          message={errorMsg?.PartyName}
          maxLength={13}
          minLength={10}
          onChange={(e) =>
            setFormValue(() => {
              return { ...formValue, contactNumber: e.target.value };
            })
          }
        />
        <AddressForm />
      </form>
    </div>
  );
};

export default CreatePartyForm;
