"use client";

import { LabeledInput } from "@/components/ui/LabledInput";
import HsnCodeForm from "../../../_components/product/HsnCodeForm";
import { useState } from "react";
import ProductVariant from "@/app/_components/product/productVariant/ProductVariant";

import CustomSelectBox from "@/components/forms/CustomSelectBox";
import { GenericCombobox } from "@/components/ui/combobox";
import { ProductVariantType } from "@/lib/types/Product/ProductVariantType";
import { v4 as uuid } from "uuid";
import { PageSubHeading } from "@/app/_components/PageHeading";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { productSchema } from "@/lib/ZodSchema/product/CreateNewProductSchema";

type Props = {
  categories: { name: string }[];
  units: { name: string; id: number }[];
  suppliers: { label: string; value: string; id: string }[];
};
const initialErrorsObj = {
  name: [],
  supplier: [],
  taxInformation: [],
  category: [],
};
const initialFormData = {
  name: "",
  supplier: {
    value: "",
    id: "",
  },
  description: "",
  category: "",
  lowStockThreshold: 10,
};
export const initialVariantData = {
  bags: 1,
  piecePerBag: 1,
  weight: 1,
  id: uuid(),
  MRP: 579,
  freightCharges: 10,
  unloading: 4,
  quantityUnitName: "KG",
};
export default function CreateNewProduct(props: Props) {
  const [formErrors, setFromErrors] = useState(initialErrorsObj);
  const [formData, setFormData] = useState(initialFormData);
  const [variants, setVariants] = useState<ProductVariantType[]>([]);
  const [taxInformation, setTaxInformation] = useState({
    gstRate: "",
    hsnCode: "",
  });

  function ResetForm() {
    setFormData(initialFormData);
    setVariants([]);
    setTaxInformation({
      gstRate: "",
      hsnCode: "",
    });
  }
  function calculateTotalStock() {
    return variants.reduce((total, prev) => {
      return (total += prev.piecePerBag * prev.bags);
    }, 0);
  }
  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();

    const dataToValidate = {
      ...formData,

      variants: variants,
      taxInformation: taxInformation,
      lowStockThreshold: Number(formData.lowStockThreshold), // Ensure threshold is a number for validation
      supplier: {
        ...formData.supplier,
        id: String(formData.supplier.id), // Ensure ID is a string, but server parses to number
      },
      inStock: calculateTotalStock(),
    };

    try {
      productSchema.parse(dataToValidate); // Client-side validation with Zod
      console.log(dataToValidate, "From client");
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToValidate),
      });

      if (response.ok) {
        toast({ title: "Product created successfully" });
        ResetForm();
        //  reset form or redirect
      } else {
        const errorData = await response.json();
        toast({
          title: `Failed to create product: ${
            errorData.message || "Unknown error"
          }`,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.flatten()); //
        // For detailed error logging
        console.log(dataToValidate);
        const err = error.flatten().fieldErrors;
        setFromErrors({ ...formErrors, ...err });
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        toast({ title: `Validation Failed: ${errorMessages}` });
      } else {
        toast({ title: "An unexpected error occurred." });
        console.error("Unexpected error:", error);
      }
    }
  }

  return (
    <div className="md:w-[90vw] w-[100vw] mx-auto space-y-6 mt-6 mb-10">
      <div className="space-y-2">
        <PageSubHeading heading="A. Basic Details" />
        <div className="grid  grid-cols-12 [&>*]:col-span-6  gap-6  ">
          <LabeledInput
            label="Product Name"
            name="name"
            message={formErrors.name}
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
            placeholder="Select Supplier"
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
            message={formErrors.category}
            placeholder="Select Category"
            value={formData.category}
            setValue={(value) => {
              setFormData({ ...formData, category: value });
            }}
          />
          <LabeledInput
            label="Low Stock Threshold"
            name="lowStockThreshold"
            message={[]}
            type="number"
            min={0}
            step={1}
            defaultValue={10}
            onChange={(e) =>
              setFormData({
                ...formData,
                lowStockThreshold: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <HsnCodeForm
        taxInformation={taxInformation}
        setTaxInformation={setTaxInformation}
        message={formErrors.taxInformation}
      />
      <ProductVariant
        variants={variants}
        setVariants={setVariants}
        units={props.units}
      />
      <div className="w-full flex justify-center items-end">
        <Button className=" w-[30vw] " onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
