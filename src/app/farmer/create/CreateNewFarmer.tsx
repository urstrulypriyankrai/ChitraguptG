"use client";
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
import { LabeledInput } from "../../../components/ui/LabledInput";
import CustomSelectBox from "../../../components/forms/CustomSelectBox"; // Assuming CustomSelectBox is in the same directory
import VILLAGE_DATA from "@/../data/villages-seoni.json";
import STATE_DATA from "@/../data/state-districts.json";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { farmerSchema, ErrorMsgObj } from "@/lib/ZodSchema/farmerSchema";

const allStates = Object.keys(STATE_DATA as StateData);
const defaultState = "Madhya Pradesh"; // Define default state as a constant
const defaultDistrict = "Seoni"; // Define default district as a constant
const defaultVillage = "khari"; // Define default village as a constant
const defaultPincode = "480991";

export default function CreateNewFarmer() {
  // Use useCallback for state setters if they are passed down and might cause re-renders
  const [formValue, setFormValue] = useState({
    partyName: "",
    partyType: "FARMER",
    aadhar: "",
    fathersName: "",
    mobile: "",
    village: defaultVillage,
    state: defaultState,
    district: defaultDistrict,
    zipCode: defaultPincode,
  });
  const [errorMsg, setErrorMsg] = useState<ErrorMsgObj>({
    partyName: [],
    fathersName: [],
    aadhar: [],
    partyType: [],
    gstNumber: [],
    mobile: [],
    street: [],
    state: [],
    email: [],
    district: [],
    zipCode: [],
  });
  const [stateValue, setStateValue] = useState<string>(defaultState);
  const [districtValue, setDistrictValue] = useState<string>(defaultDistrict);
  const [villageValue, setVillageValue] = useState<string>(defaultVillage);
  const [possibleDistrictValue, setPossibleDistrictValue] = useState<
    string[] | null
  >(null);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // --- Fetch Districts based on State (using useCallback for memoization) ---
  const fetchDistrictsForState = useCallback(
    (selectedState: string | number) => {
      if (!selectedState) {
        setPossibleDistrictValue(null);
        return;
      }
      const districts =
        (STATE_DATA as StateData)[selectedState]?.districts || [];
      setPossibleDistrictValue(districts);
    },
    []
  );

  useEffect(() => {
    fetchDistrictsForState(stateValue); // Fetch districts when stateValue changes
  }, [stateValue, fetchDistrictsForState]);

  // --- Initialize district options on component mount ---
  useEffect(() => {
    fetchDistrictsForState(defaultState); // Initialize districts for default state
  }, [fetchDistrictsForState]);

  // --- Update formValue when district, state, village change ---
  useEffect(() => {
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      district: districtValue,
      state: stateValue,
      village: villageValue,
    }));
  }, [districtValue, stateValue, villageValue]);

  // --- Validation Effects (using useCallback for no unnecessary re-renders) ---
  const validateMobile = useCallback(() => {
    const data = z
      .string()
      .min(10, "Invalid mobile number")
      .max(13, "Invalid mobile number")
      .safeParse(formValue.mobile);
    if (!data.success)
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        mobile: data.error.flatten().formErrors,
      }));
    else setErrorMsg((prevErrors) => ({ ...prevErrors, mobile: [] }));
  }, [formValue.mobile]);

  const validatePartyName = useCallback(() => {
    const data = z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .safeParse(formValue.partyName);
    if (!data.success)
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        partyName: data.error.flatten().formErrors,
      }));
    else setErrorMsg((prevErrors) => ({ ...prevErrors, partyName: [] }));
  }, [formValue.partyName]);

  const validateFathersName = useCallback(() => {
    const data = z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .safeParse(formValue.fathersName);
    if (!data.success)
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        fathersName: data.error.flatten().formErrors,
      }));
    else setErrorMsg((prevErrors) => ({ ...prevErrors, fathersName: [] }));
  }, [formValue.fathersName]);

  useEffect(() => {
    validateMobile();
  }, [validateMobile]);
  useEffect(() => {
    validatePartyName();
  }, [validatePartyName]);
  useEffect(() => {
    validateFathersName();
  }, [validateFathersName]);

  // --- Handle Submit ---
  async function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const data = farmerSchema.safeParse(formValue);

      setIsLoading(true);
      if (data.success) {
        const res = await fetch("/api/farmer", {
          method: "POST",
          body: JSON.stringify(formValue),
        });
        let response = await res.json();

        if (res.status === 200) {
          response = JSON.parse(response.data);
          toast({
            title: `✅ Farmer Created Sucessfull`,
            description: `farmerName: ${response.name}`,
            variant: "default",
          });
          console.log("toast should be called");
          await fetch("/api/revalidate?tag=getAllParty");
        } else {
          toast({
            title: `❌ Unable to create farmer`,
            description: `${response.message}`,
            variant: "destructive",
          });
        }
      } else {
        // Validation failed, handle errors
        if (data.error) {
          const error = data.error.flatten().fieldErrors;
          Object.entries(error).map(([key, value]) => {
            setErrorMsg({ ...errorMsg, [key]: value });
          });
          console.log(error);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        toast({
          title: `❌ Unable to create farmer`,
          description: `farmerName: ${err.message}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="md:w-[60vw] w-[90vw] mx-auto">
      <div className="space-y-6 mb-6">
        <LabeledInput
          name="PartyName"
          label="Enter Name"
          required
          message={errorMsg?.partyName}
          onChange={(e) =>
            setFormValue((prev) => ({ ...prev, partyName: e.target.value }))
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
            setFormValue((prev) => ({ ...prev, mobile: e.target.value }))
          }
        />
        <LabeledInput
          name="aadhar"
          label="Enter Aadhar Number"
          required
          type="number"
          message={errorMsg?.aadhar}
          maxLength={13}
          minLength={10}
          onChange={(e) =>
            setFormValue((prev) => ({ ...prev, aadhar: e.target.value }))
          }
        />
        <LabeledInput
          name="fathersName"
          label="Enter Fathers Name"
          required
          type="text"
          message={errorMsg.fathersName}
          minLength={3}
          onChange={(e) =>
            setFormValue((prev) => ({ ...prev, fathersName: e.target.value }))
          }
        />

        <div className="">
          <h2>Address details</h2>
          <div className="grid md:grid-cols-12 grid-cols-6 [&>*]:col-span-6 p-6 gap-6 my-2 w-full">
            <CustomSelectBox
              data={Object.keys(VILLAGE_DATA.villages)}
              name="village"
              setValue={(value) => {
                setVillageValue(value);
              }}
              placeholder="Enter village"
              defaultValue={defaultVillage}
              message={[]}
            />

            <CustomSelectBox
              data={allStates}
              name="state"
              setValue={(value) => {
                setStateValue(value);
                if (value) {
                  // Fetch districts immediately when state changes
                  fetchDistrictsForState(value);
                } else {
                  setPossibleDistrictValue(null); // Clear districts if state is cleared (if possible in your UI)
                }
              }}
              placeholder="Select a State"
              disabled={false}
              onOpenChange={() => setIsStateOpen(!isStateOpen)}
              defaultValue={defaultState}
              message={errorMsg.state}
            />

            <CustomSelectBox
              data={possibleDistrictValue || ["Seoni"]}
              name="district"
              setValue={(value) => {
                setDistrictValue(value);
              }}
              placeholder="Select a District"
              defaultValue={defaultDistrict}
              disabled={!possibleDistrictValue}
              message={errorMsg.district}
            />

            <LabeledInput
              name="pincode"
              label="Enter Office Pincode"
              type="number"
              defaultValue={defaultPincode}
              message={errorMsg?.zipCode}
              minLength={6}
              maxLength={6}
              required
              onChange={(e) =>
                setFormValue((prev) => ({ ...prev, zipCode: e.target.value }))
              }
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          className="text-center mx-auto w-full mb-6 "
          disabled={isLoading}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

interface StateData {
  [state: string]: DistrictData;
}
interface DistrictData {
  districts: string[];
  district_count: number;
}
