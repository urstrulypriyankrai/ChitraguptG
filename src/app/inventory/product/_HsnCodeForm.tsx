"use client";
import { LabeledInput } from "@/components/ui/LabledInput";

import React, { useEffect, useState } from "react";

const HsnCodeForm = () => {
  const [hsnCode, setHsnCode] = useState("");
  const [taxData, setTaxData] = useState({
    hsnCode: "",
    gstRate: "",
  });

  useEffect(() => {
    if (hsnCode.length < 4) return;
    const ref = setTimeout(async () => {
      let res = await fetch(`/api/product/hsnCode?hsnCode=${hsnCode}`);
      res = await res.json();
      console.log(res);
    }, 2000);

    return () => clearTimeout(ref);
  }, [hsnCode]);

  return (
    <div>
      <h2>Tax Details</h2>
      <LabeledInput
        label="HSN Code"
        name="hsnCode"
        message={[]}
        type="number"
        minLength={4}
        maxLength={8}
        onChange={(e) => setHsnCode(e.target.value)}
      />
    </div>
  );
};

export default HsnCodeForm;
