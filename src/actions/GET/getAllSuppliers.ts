"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export default async function getAllSuppliers() {
  try {
    const suppliers = await unstable_cache(
      async () => {
        return prisma.party.findMany({
          where: {
            partyType: "SUPPLIER",
          },
        });
      },
      ["allSuppliers"],
      {
        tags: ["allSuppliers"],
      }
    )();

    return suppliers;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}
