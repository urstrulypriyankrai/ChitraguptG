import { PageSubHeading } from "@/app/_components/PageHeading";
import React from "react";

type Props = {};

const ProductVariant = (props: Props) => {
  console.log(props);
  return (
    <div>
      <PageSubHeading heading="B. Product Variants" />
    </div>
  );
};

export default ProductVariant;
