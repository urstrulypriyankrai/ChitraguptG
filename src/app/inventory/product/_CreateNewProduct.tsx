"use client";
import PageHeading from "@/app/_components/PageHeading";
import { LabeledInput } from "@/components/ui/LabledInput";
import React, { useState } from "react";

type Props = {};

export default function _CreateNewProduct() {
  return (
    <>
      <PageHeading heading="Create A New Product " />
      <NewProductForm />
    </>
  );
}

const NewProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  return (
    <div className="md:w-[60vw] w-[90vw] mx-auto space-y-6 mt-6">
      <LabeledInput label="Product Name" />
      <LabeledInput label="Product Description" />
      <LabeledInput label="Product Name" />
    </div>
  );
};
