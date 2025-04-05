"use server";

import { unstable_cache } from "next/cache";

export default async function getAllCategories() {
  try {
    const category = await unstable_cache(
      async () => {
        return prisma.productCategory.findMany();
      },
      ["getAllCategories"],
      {
        tags: ["getAllCategories"],
      }
    )();

    return category;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}
