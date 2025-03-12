import { PageSubHeading } from "@/app/_components/PageHeading";
import CustomSelectBox from "@/components/forms/CustomSelectBox";
import { LabeledInput } from "@/components/ui/LabledInput";
import { Button } from "@/components/ui/button";
import { ProductVariantType } from "@/lib/types/Product/ProductVariantType";
import { v4 as uuid } from "uuid";
import React, { useState, useCallback } from "react"; // Import useState and useCallback

type Props = {
  variants: ProductVariantType[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariantType[]>>;
  units: string[];
};

const ProductVariant = (props: Props) => {
  const handleAddNewVariant = (e: React.MouseEvent) => {
    e.preventDefault();
    const newVariant = {
      bags: 1,
      piecesPerBag: 1,
      weight: 1,
      quantityUnit: "KG", // Add default quantityUnit
      _id: uuid(),
      MRP: 0,
      Unloading: 0, // Add default Unloading
      FreightCharges: 0, // Add default FreightCharges (for other charges)
    };
    props.setVariants((prev) => [...prev, newVariant]);
  };
  const handDeleteVariant = (id: string) => {
    const updatedVariants = props.variants.filter(
      (variant) => variant._id !== id
    );
    props.setVariants(updatedVariants);
  };

  const handleVariantChange = useCallback(
    (updatedVariant: ProductVariantType) => {
      const updatedVariants = props.variants.map((variant) =>
        variant._id === updatedVariant._id ? updatedVariant : variant
      );
      props.setVariants(updatedVariants);
    },
    [props.variants, props.setVariants]
  );

  return (
    <div className="min-h-64 ">
      <div className="flex justify-between space-y-2 mb-6 ">
        <PageSubHeading heading="C. Product Variants" />
        <Button className=" rounded-md" onClick={handleAddNewVariant}>
          Add new variant{" "}
        </Button>
      </div>
      <div className="space-y-6">
        {props?.variants.map((variant) => {
          return (
            <>
              <ProductVariantRow
                key={variant._id}
                variant={variant}
                units={props.units}
                onDelete={() => handDeleteVariant(variant._id)}
                onChange={handleVariantChange} // Pass onChange handler
              />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariant;

function ProductVariantRow({
  variant,
  units,
  onDelete,
  onChange, // Add onChange prop
}: {
  variant: ProductVariantType;
  units: string[];
  onDelete: () => void;
  onChange: (updatedVariant: ProductVariantType) => void; // Define onChange prop type
}) {
  const [localVariant, setLocalVariant] = useState<ProductVariantType>(variant); // Local state for variant

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedLocalVariant = {
      ...localVariant,
      [name]:
        name === "bags" ||
        name === "piecesPerBag" ||
        name === "weight" ||
        name === "Unloading" || // Add Unloading to numeric fields
        name === "otherCharges" || // Add otherCharges to numeric fields
        name === "MRP" // Keep MRP as numeric
          ? Number(value)
          : value,
    };
    setLocalVariant(updatedLocalVariant);
    onChange(updatedLocalVariant); // Call onChange to update parent state
  };

  const handleUnitSelect = (unit: string) => {
    const updatedLocalVariant = {
      ...localVariant,
      quantityUnit: unit,
    };
    setLocalVariant(updatedLocalVariant);
    onChange(updatedLocalVariant); // Call onChange to update parent state
  };

  return (
    <div className="flex flex-row [&>*]:w-full space-x-6 mt-2 botder-b-2 border p-6">
      <div className="w-full grid lg:grid-cols-7 gap-6 xs:grid-cols-1 sm:grid-cols-2  md:grid-cols-4  ">
        <LabeledInput
          label="Number Of Bags"
          name="bags"
          message={[]}
          type="number"
          min={1}
          max={1000}
          defaultValue={variant.bags} // Use variant's value
          onChange={handleChange} // Implement handleChange
        />
        <LabeledInput
          label="Piece Per Bag"
          name="piecesPerBag"
          message={[]}
          type="number"
          min={1}
          defaultValue={variant.piecesPerBag} // Use variant's value
          onChange={handleChange} // Implement handleChange
        />
        <LabeledInput
          label="Weight of Unit"
          name="weight"
          message={[]}
          type="number"
          min={1}
          defaultValue={variant.weight} // Use variant's value
          onChange={handleChange} // Implement handleChange
        />

        <CustomSelectBox
          placeholder="Enter Quantity Unit"
          name="quantityUnit" // Correct name to quantityUnit
          message={[]}
          data={units}
          defaultValue={variant.unit} // Use variant's value
          setValue={handleUnitSelect} // Implement setValue
          value={localVariant.unit} // Implement value
        />
        <LabeledInput
          label="MRP / Unit"
          name="MRP"
          message={[]}
          type="number"
          min={1}
          defaultValue={variant.MRP} // Use variant's value
          onChange={handleChange} // Implement handleChange
        />
        <LabeledInput
          label="Unloading"
          name="Unloading"
          message={[]}
          type="number"
          min={0}
          max={1000}
          defaultValue={variant.Unloading} // Use variant's value
          onChange={handleChange} // Implement handleChange
        />
        <LabeledInput
          label="Other Charges"
          name="otherCharges"
          message={[]}
          type="number"
          min={0}
          max={1000}
          defaultValue={variant.FreightCharges} // Use variant's value
          onChange={handleChange} // Implement handleChange
        />
      </div>

      <Button
        className="w-[10px] max-w-1 flex justify-center items-center h-full my-auto"
        onClick={handleDelete}
      >
        X
      </Button>
    </div>
  );
}
