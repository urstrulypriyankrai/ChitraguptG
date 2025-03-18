"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
type OptionsType = Prisma.TaxFindManyArgs;

export default async function getAllTaxes(options: OptionsType = {}) {
  try {
    const taxes = await unstable_cache(
      async () => {
        return prisma.tax.findMany(options);
      },
      ["getAllTaxes"],
      {
        tags: ["getAllTaxes"],
      }
    )();

    return taxes;
  } catch (error) {
    console.error("Error fetching taxes:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}
