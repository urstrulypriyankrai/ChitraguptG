"use client";

import { LabeledInput } from "@/components/ui/LabledInput";
import _HsnCodeForm from "./_HsnCodeForm";
import { useState } from "react";
import ProductVariant from "@/app/_components/product/productVariant/ProductVariant";

import CustomSelectBox from "@/components/forms/CustomSelectBox";
import { GenericCombobox } from "@/components/ui/combobox";
import { ProductVariantType } from "@/lib/types/Product/ProductVariantType";
import { v4 as uuid } from "uuid";
import { PageSubHeading } from "@/app/_components/PageHeading";
type Props = {
  categories: { name: string }[];
  units: { name: string }[];
  suppliers: { label: string; value: string; id: string }[];
};
export default function CreateNewProduct(props: Props) {
  const [formData, setFormData] = useState({
    name: "",
    supplier: {
      value: "Select Supplier",
      id: "",
    },
    description: "",
    category: "",
    lowStockThreshold: 10,
  });
  const [variants, setVariants] = useState<ProductVariantType[]>([
    {
      bags: 0,
      piecesPerBag: 0,
      weight: 0,
      _id: uuid(),
      MRP: 0,
      FreightCharges: 0,
      Unloading: 0,
    },
  ]);
  const [taxInformation, setTaxInformation] = useState({
    gstRate: "",
    hsnCode: "",
  });

  return (
    <div className="md:w-[90vw] w-[100vw] mx-auto space-y-6 mt-6">
      <div className="space-y-2">
        <PageSubHeading heading="A. Basic Details" />
        <div className="grid  grid-cols-12 [&>*]:col-span-6  gap-6  ">
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
          <GenericCombobox
            // placeholder="Select Supplier"
            data={props?.suppliers}
            setValue={(val) => {
              console.log(val);
              setFormData({
                ...formData,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                supplier: { value: val.value, id: val.id },
              });
            }}
            value={formData.supplier}
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
        </div>
      </div>

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
