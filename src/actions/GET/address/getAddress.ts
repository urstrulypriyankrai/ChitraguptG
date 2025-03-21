"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
type OptionsType = Prisma.AddressFindUniqueArgs;

export default async function getAddress(options: OptionsType) {
  try {
    const address = await unstable_cache(
      async () => {
        return prisma.address.findUnique(options);
      },
      ["getAddress"],
      {
        tags: ["getAddress"],
      }
    )();

    return address;
  } catch (error) {
    console.error("Error fetching parties:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}
