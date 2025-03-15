"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export default async function getALlProducts() {
  try {
    const data = await unstable_cache(
      async () => {
        return prisma.product.findMany({
          include: {
            category: true,
            ProductSupplier: true,
            variants: true,
          },
        });
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
