"use server";

import { toast } from "@/hooks/use-toast";
import prisma from "@/lib/prisma";

export async function createCategoryAction(formData: FormData) {
  try {
    const categoryName = formData.get("category") as string;
    // console.log(categoryName);

    const response = await prisma.productCategory.create({
      data: { name: categoryName },
    });
    if (response.name) {
      toast({
        title: `✅ New Category Created Sucessfull`,
        description: `category name: ${response.name}`,
        variant: "default",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      toast({
        title: `❌ Unable to create category`,
        description: `error:  ${error.message}`,
        variant: "destructive",
      });
    }
  }
}
