"use client";
import React, { useEffect, useState } from "react";
import { LabeledInput } from "../ui/LabledInput";
import Data from "@/../data/state-districts.json";
import CustomSelectBox from "./CustomSelectBox";

const allStates = Object.keys(Data as StateData);

const AddressForm = () => {
  const [stateValue, setStateValue] = useState<string | null>(null);
  const [districtValue, setDistrictValue] = useState<string[] | null>(null);

  useEffect(() => {
    if (stateValue) {
      const stateData = (Data as StateData)[stateValue];
      setDistrictValue(stateData?.districts || []);
    } else {
      setDistrictValue(null);
    }
  }, [stateValue]);

  return (
    <div className="">
      <h2>Address details</h2>
      <div className="  grid md:grid-cols-12 grid-cols-6 [&>*]:col-span-3   p-6 gap-6 my-2  w-full ">
        <LabeledInput
          name="address"
          label="Enter Office Locality"
          type="locality"
          required
        />

        <CustomSelectBox
          data={allStates}
          name="state"
          setValue={setStateValue}
          placeholder="Select a State" // Added placeholder
        />

        {districtValue && districtValue.length > 0 ? (
          <CustomSelectBox
            data={districtValue}
            name="district"
            // Pass setValue for district
            placeholder="Select a District" // Added placeholder
          />
        ) : (
          <CustomSelectBox
            data={[]}
            name="district"
            disabled // disabled untill state selected
            placeholder="Select a District"
          />
        )}

        <LabeledInput
          name="pincode"
          label="Enter Office Pincode"
          type="number"
          defaultValue={480991}
          min={6}
          max={6}
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
