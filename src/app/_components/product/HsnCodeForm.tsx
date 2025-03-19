"use client";
import { PageSubHeading } from "@/app/_components/PageHeading";
import CustomSelectBox from "@/components/forms/CustomSelectBox";
import { LabeledInput } from "@/components/ui/LabledInput";
import React, { useEffect, useState } from "react";
type Props = {
  taxInformation: { hsnCode: string; gstRate: string };
  setTaxInformation: React.Dispatch<
    React.SetStateAction<{ hsnCode: string; gstRate: string }>
  >;
  message: string[];
};
const HsnCodeForm = ({ taxInformation, setTaxInformation, message }: Props) => {
  const [isGstRateDisabled, setisGstRateDisabled] = useState(false);
  useEffect(() => {
    setisGstRateDisabled(false);
    if (taxInformation.hsnCode.length < 4) return;
    const ref = setTimeout(async () => {
      const response = await fetch(
        `/api/product/hsnCode?hsnCode=${taxInformation.hsnCode}`
      );
      const res = await response.json();
      if (res.gstRate) {
        setTaxInformation({
          ...taxInformation,
          gstRate: res.gstRate,
        });
        setisGstRateDisabled(true);
      }
    }, 2000);

    return () => clearTimeout(ref);
  }, [taxInformation.hsnCode]);

  return (
    <div>
      <PageSubHeading heading="B. Tax Details" />
      <div className="flex flex-row [&>*]:w-full space-x-6 mt-2">
        <LabeledInput
          label="HSN Code"
          name="hsnCode"
          message={message}
          type="number"
          minLength={4}
          maxLength={8}
          onChange={(e) =>
            setTaxInformation({ ...taxInformation, hsnCode: e.target.value })
          }
        />

        <CustomSelectBox
          data={
            isGstRateDisabled
              ? [taxInformation.gstRate]
              : ["ZERO", "FIVE", "EIGHTEEN", "TWENTY_EIGHT"]
          }
          name="gstRate"
          placeholder="Select GST Rate"
          message={[]}
          disabled={isGstRateDisabled}
          value={isGstRateDisabled ? taxInformation.gstRate : undefined}
          setValue={(value) => {
            if (!isGstRateDisabled)
              setTaxInformation((prev) => ({
                ...prev,
                gstRate: value,
              }));
          }}
        />
      </div>
    </div>
  );
};

export default HsnCodeForm;
