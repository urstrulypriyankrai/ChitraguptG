"use client";

import PageHeading, { PageSubHeading } from "@/app/_components/PageHeading";
import { LabeledInput } from "@/components/ui/LabledInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const Page = () => {
  const [name, setName] = useState("");
  const { pending } = useFormStatus();
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setValidationError(null); // Reset validation errors

    const validation = categorySchema.safeParse({ name });

    if (!validation.success) {
      setValidationError(validation.error.errors[0].message);
      return;
    }

    try {
      const response = await fetch("/api/product/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "✅ New Category Created!",
          description: `New Category name: ${data.category.name}`,
          variant: "default",
        });
        setName(""); // Clear input on success
      } else {
        if (response.status === 400) {
          toast({
            title: "Validation Error",
            description: data.errors
              ? data.errors[0].message
              : data.message || "Invalid input",
            variant: "destructive",
          });
        } else if (response.status === 409) {
          toast({
            title: "Category Already Exists",
            description:
              data.message || "A category with that name already exists.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error creating category",
            description: data.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Unable to create new category",
          description: `error message: ${err.message}`,
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="w-full m-2">
      <PageHeading heading="Manage Product Categories" />
      <div className="md:w-[60vw] w-[90vw] mx-auto space-y-1 mt-2">
        <PageSubHeading heading="Create new Categories" />
        <div className="flex flex-col md:flex-row md:space-x-6 [&>*]:w-full space-y-1 items-center">
          <LabeledInput
            label="Enter Category Name"
            name="category"
            message={validationError ? [validationError] : []}
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <Button type="button" disabled={pending} onClick={handleSubmit}>
            {pending ? "Adding..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
