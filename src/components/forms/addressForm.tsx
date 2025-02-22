"use client";
import React, { useEffect, useState } from "react";
import { LabeledInput } from "../ui/LabledInput";
import Data from "@/../data/state-districts.json";
import CustomSelectBox from "./CustomSelectBox";
import { FormObjectType } from "@/lib/types/forms";
import villages from "@/../data/villages-seoni.json";
const allStates = Object.keys(Data as StateData);

const AddressForm = ({
  formValue,
  setFormValue,
}: {
  formValue: FormObjectType;
  setFormValue: (prev: FormObjectType) => void;
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
        {formValue.partyType == "FARMER" ? (
          <>
            <CustomSelectBox
              data={Object.keys(villages.villages)}
              name="street"
              setValue={setStateValue}
              placeholder="Enter village"
            />
            <LabeledInput
              name="fathersName"
              label="Enter Father Name"
              type="text"
              required
              onChange={(e) => {
                setFormValue({ ...formValue, fathersName: e.target.value });
              }}
            />
          </>
        ) : (
          <LabeledInput
            name="street"
            label="Enter Office Locality"
            type="text"
            required
            onChange={(e) => {
              console.log(e.target.value, "form ti");
              setFormValue({ ...formValue, street: e.target.value });
            }}
          />
        )}

        <CustomSelectBox
          data={allStates}
          name="state"
          setValue={setStateValue}
          placeholder="Select a State"
          disabled={false}
          onOpenChange={() => setIsStateOpen(!isStateOpen)}
        />

        <CustomSelectBox
          data={possibleDistrictValue || []}
          name="district"
          setValue={setDistrictValue}
          disabled={!possibleDistrictValue?.length}
          placeholder="Select a District"
        />

        <LabeledInput
          name="pincode"
          label="Enter Office Pincode"
          type="number"
          defaultValue={480991}
          minLength={6}
          maxLength={6}
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
