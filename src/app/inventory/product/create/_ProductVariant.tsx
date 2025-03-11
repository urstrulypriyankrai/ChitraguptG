import { PageSubHeading } from "@/app/_components/PageHeading";
import CustomSelectBox from "@/components/forms/CustomSelectBox";
import { LabeledInput } from "@/components/ui/LabledInput";
import { ProductVariantUnit } from "@/lib/types/product";
import React from "react";

type Props = {
  variants: ProductVariantUnit[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariantUnit[]>>;
  units: string[];
};

const ProductVariant = (props: Props) => {
  return (
    <>
      <PageSubHeading heading="B. Product Variants" />
      <div className="flex flex-row [&>*]:w-full space-x-6 mt-2">
        <LabeledInput
          label="Enter Quantity of Product"
          name="quantity"
          message={[]}
        />
        <CustomSelectBox
          placeholder="Enter Quantity Unit"
          name="quantity"
          message={[]}
          data={props.units}
        />
      </div>
    </>
  );
};

export default ProductVariant;
