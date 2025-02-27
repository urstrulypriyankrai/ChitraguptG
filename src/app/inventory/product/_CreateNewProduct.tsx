"use client";
import PageHeading from "@/app/_components/PageHeading";
import CustomSelectBox from "@/components/forms/CustomSelectBox";
import { LabeledInput } from "@/components/ui/LabledInput";
import { CATEGORY } from "@/lib/ZodSchema/productSchema";
import _HsnCodeForm from "./_HsnCodeForm";
import React, { useState } from "react";

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
    category: CATEGORY[0],
    lowStockThreshold: 10,
  });
  const [variants, setVariants] = useState([
    {
      weight: 0,
      weightUnit: "KG",
      price: 0,
      costPrice: 0,
      inStock: 0,
      goDownLocation: "",
    },
  ]);

  return (
    <div className="md:w-[60vw] w-[90vw] mx-auto space-y-6 mt-6">
      <LabeledInput
        label="Product Name"
        name="name"
        message={[]}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <LabeledInput
        label="Product Description"
        name="description"
        message={[]}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <CustomSelectBox
        name="category"
        data={CATEGORY}
        message={[]}
        placeholder="Select Category"
      />
      {/* <LabeledInput
        label="HSN Code"
        name="hsnCode"
        message={[]}
        type="number"
        minLength={4}
        maxLength={8}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      /> */}
      <_HsnCodeForm />
    </div>
  );
};
