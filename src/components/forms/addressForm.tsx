"use client";
import React, { useEffect, useState } from "react";
import { LabeledInput } from "../ui/LabledInput";
import Data from "@/../data/state-districts.json";
import CustomSelectBox from "./CustomSelectBox";
import { ErrorMsgObj, FormObjectType } from "@/lib/types/forms";
const allStates = Object.keys(Data as StateData);

const AddressForm = ({
  formValue,
  setFormValue,
  errorMsg,
}: {
  formValue: FormObjectType;
  setFormValue: (prev: FormObjectType) => void;
  errorMsg: ErrorMsgObj;
}) => {
  const [stateValue, setStateValue] = useState<string>("");
  const [districtValue, setDistrictValue] = useState("");
  const [possibleDistrictValue, setPossibleDistrictValue] = useState<
    string[] | null
  >(null);
  const [isStateOpen, setIsStateOpen] = useState(false);

  useEffect(() => {
    if (!stateValue) return;
    const allDistrict = (Data as StateData)[stateValue]?.districts || [];
    setPossibleDistrictValue(allDistrict);
    setDistrictValue(""); // Reset district when state changes
  }, [stateValue]);

  useEffect(() => {
    setFormValue({
      ...formValue,
      district: districtValue,
      state: stateValue,
    });
  }, [districtValue]);
  return (
    <div className="">
      <h2>Address details</h2>
      <div className="grid md:grid-cols-12 grid-cols-6 [&>*]:col-span-6 p-6 gap-6 my-2 w-full">
        <LabeledInput
          name="street"
          label="Enter Office Locality"
          type="text"
          required
          message={errorMsg.street}
          onChange={(e) => {
            setFormValue({ ...formValue, street: e.target.value });
          }}
        />

        <CustomSelectBox
          data={allStates}
          name="state"
          setValue={setStateValue}
          placeholder="Select a State"
          disabled={false}
          onOpenChange={() => setIsStateOpen(!isStateOpen)}
          message={errorMsg.state}
        />

        <CustomSelectBox
          data={possibleDistrictValue || []}
          name="district"
          setValue={setDistrictValue}
          disabled={!possibleDistrictValue?.length}
          placeholder="Select a District"
          message={errorMsg.district}
        />

        <LabeledInput
          name="pincode"
          label="Enter Office Pincode"
          type="number"
          defaultValue={480991}
          minLength={6}
          maxLength={6}
          message={errorMsg.zipCode}
          required
        />
      </div>
    </div>
  );
};

export default AddressForm;

interface DistrictData {
  districts: string[];
  district_count: number;
}

interface StateData {
  [state: string]: DistrictData;
}
