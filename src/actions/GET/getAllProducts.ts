"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

export default async function getALlProducts(
  options: Prisma.ProductFindManyArgs = {}
) {
  try {
    const data = await unstable_cache(
      async () => {
        return await prisma.product.findMany(options);
      },
      ["allProducts"],
      {
        tags: ["allProducts"],
      }
    )();

    return data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}
