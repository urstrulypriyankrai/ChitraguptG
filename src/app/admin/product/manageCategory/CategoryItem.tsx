"use client";

import { LabeledInput } from "@/components/ui/LabledInput";
import { Button } from "@/components/ui/button";
import { SetStateAction, useState } from "react";

const CategoryItem = ({
  categories,
}: {
  categories: {
    name: string;
  }[];
}) => {
  return (
    <>
      <div>
        <ul>
          {categories.map((category: { name: string }) => {
            return (
              <CategoryListItem key={category.name} name={category.name} />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default CategoryItem;

const CategoryListItem = ({ name }: { name: string }) => {
  const [isEditPressed, setIsEditPressed] = useState(false);
  const [labelValue, setLabelValue] = useState("");

  return (
    <li key={name} className="p-2 border-b">
      <div className="w-full flex justify-between">
        {isEditPressed ? (
          <LabeledInput
            label="Enter New Name"
            message={[]}
            name={name}
            value={name}
            onChange={(e) => {
              setLabelValue(e.target.value);
            }}
          />
        ) : (
          <span>{name}</span>
        )}
        <CategoryButton
          name={name}
          labelValue={labelValue}
          isEditPressed={isEditPressed}
          setIsEditPressed={setIsEditPressed}
        />
      </div>
    </li>
  );
};

const CategoryButton = ({
  name,
  labelValue,
  isEditPressed,
  setIsEditPressed,
}: {
  name: string;
  labelValue: string;
  isEditPressed: boolean;
  setIsEditPressed: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="space-x-2">
      {!isEditPressed ? (
        <Button
          onClick={() => {
            setIsEditPressed((prev) => !prev);
          }}
        >
          Edit
        </Button>
      ) : (
        <Button
          onClick={() => {
            setIsEditPressed((prev) => !prev);
            if (name != labelValue) {
              //do save the value
              
            }
          }}
        >
          Save
        </Button>
      )}
      <Button>Delete</Button>
    </div>
  );
};
