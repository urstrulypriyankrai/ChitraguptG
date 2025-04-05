"use client";

import { LabeledInput } from "@/components/ui/LabledInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { categorySchema } from "@/lib/ZodSchema/categorySchema";
import { useRouter } from "next/navigation";

import { useState } from "react";

const CategoryItem = ({ categories }: { categories: { name: string }[] }) => {
  return (
    <div>
      <ul>
        {categories.map(({ name }) => (
          <CategoryListItem key={name} name={name} />
        ))}
      </ul>
    </div>
  );
};

export default CategoryItem;

const CategoryListItem = ({ name }: { name: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelValue, setLabelValue] = useState(name);

  return (
    <li className="p-2 border-b">
      <div className="flex justify-between w-full">
        {isEditing ? (
          <LabeledInput
            label="Enter New Name"
            message={[]}
            name={name}
            value={labelValue}
            onChange={(e) => setLabelValue(e.target.value)}
          />
        ) : (
          <span>{name}</span>
        )}
        <CategoryActions
          prevName={name}
          labelValue={labelValue}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>
    </li>
  );
};

const CategoryActions = ({
  prevName,
  labelValue,
  isEditing,
  setIsEditing,
}: {
  prevName: string;
  labelValue: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (prevName === labelValue) {
      setIsEditing(false);
      return;
    }

    setIsDisabled(true);
    const isValidated = categorySchema.safeParse({ name: labelValue });

    if (!isValidated.success) {
      toast({
        title: "Unable to Update Category Name",
        description: "Validation Failed!",
        variant: "destructive",
      });
      setIsDisabled(false);
      return;
    }

    try {
      const res = await fetch("/api/product/category", {
        method: "PATCH",
        body: JSON.stringify({ newName: labelValue, prevName }),
      });

      if (res.ok) {
        toast({
          title: "Category Name Changed Successfully",
          variant: "default",
        });
        // revalidateCategoryAction();
        await fetch("/api/revalidate?tag=getAllCategories");
      } else {
        throw new Error("Failed to update category.");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setIsDisabled(false);
      setIsEditing(false);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${prevName}"?`)) return;

    setIsDisabled(true);
    try {
      const res = await fetch(`/api/product/category`, {
        method: "DELETE",
        body: JSON.stringify({ name: prevName }),
      });

      if (res.ok) {
        router.refresh();
        toast({
          title: "Category Deleted Successfully",
          variant: "default",
        });

        await fetch("/api/revalidate?tag=getAllCategories");
      } else {
        throw new Error("Failed to delete category.");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Delete Failed",
        description: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="space-x-2">
      {!isEditing ? (
        <Button onClick={() => setIsEditing(true)} disabled={isDisabled}>
          Edit
        </Button>
      ) : (
        <Button onClick={handleSave} disabled={isDisabled}>
          Save
        </Button>
      )}
      <Button
        onClick={handleDelete}
        disabled={isDisabled}
        variant="destructive"
      >
        Delete
      </Button>
    </div>
  );
};
