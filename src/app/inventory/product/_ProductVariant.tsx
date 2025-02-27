import { PageSubHeading } from "@/app/_components/PageHeading";
import CustomSelectBox from "@/components/forms/CustomSelectBox";
import { LabeledInput } from "@/components/ui/LabledInput";
import { ProductVariantUnit } from "@/lib/types/product";
import React from "react";

type Props = {
  variants: ProductVariantUnit[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariantUnit[]>>;
};

const ProductVariant = (props: Props) => {
  console.log(props);
  return (
    <>
      <PageSubHeading heading="B. Product Variants" />
      <div className="mt-1">
        <LabeledInput
          label="Enter Quantity of Product"
          name="quantity"
          message={[]}
        />
        <CustomSelectBox
          placeholder="Enter Quantity Unit"
          name="quantity"
          message={[]}
          data={[]}
        />
      </div>
    </>
  );
};

export default ProductVariant;
