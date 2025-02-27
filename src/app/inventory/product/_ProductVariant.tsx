import { PageSubHeading } from "@/app/_components/PageHeading";
import React from "react";

type Props = {
  variants: {
    quantity: string;
  };
  setVariants: React.Dispatch<React.SetStateAction<{ quantity: string }>>;
};

const ProductVariant = (props: Props) => {
  console.log(props);
  return (
    <div>
      <PageSubHeading heading="B. Product Variants" />
    </div>
  );
};

export default ProductVariant;
