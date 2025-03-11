"use client";

import { LabeledInput } from "@/components/ui/LabledInput";
import _HsnCodeForm from "./_HsnCodeForm";
import { useState } from "react";
import ProductVariant from "./_ProductVariant";

import CustomSelectBox from "@/components/forms/CustomSelectBox";
import { GenericCombobox } from "@/components/ui/combobox";

type Props = {
  categories: { name: string }[];
  units: { name: string }[];
  suppliers: { label: string; value: string; id: string }[];
};
export default function CreateNewProduct(props: Props) {
  const [formData, setFormData] = useState({
    name: "",
    supplier: {
      value: "",
      id: "",
    },
    description: "",
    category: "",
    lowStockThreshold: 10,
  });
  const [variants, setVariants] = useState([
    {
      quantity: 0,
      quantityUnit: "KG",
      price: 0,
      costPrice: 0,
      sellingPrice: 0,
      inStock: 0,
      warehouseLocation: "",
    },
  ]);
  const [taxInformation, setTaxInformation] = useState({
    gstRate: "",
    hsnCode: "",
  });

  return (
    <div className="md:w-[60vw] w-[90vw] mx-auto space-y-6 mt-6">
      <GenericCombobox
        // placeholder="Select Supplier"
        data={props?.suppliers}
        setValue={(val) => {
          console.log(val);
        }}
        value={formData.supplier}
      />
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
        data={props.categories.map((val) => val.name)}
        message={[]}
        placeholder="Select Category"
        setValue={(value) => {
          setFormData({ ...formData, category: value });
        }}
      />

      <_HsnCodeForm
        taxInformation={taxInformation}
        setTaxInformation={setTaxInformation}
      />
      <ProductVariant
        variants={variants}
        setVariants={setVariants}
        units={props.units.map((val) => val.name)}
      />
    </div>
  );
}
