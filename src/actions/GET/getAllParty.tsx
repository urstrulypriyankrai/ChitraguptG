"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
type OptionsType = Prisma.PartyFindManyArgs;

export default async function getAllParty(options: OptionsType = {}) {
  try {
    const parties = await unstable_cache(
      async () => {
        return prisma.party.findMany(options);
      },
      ["getAllParty"],
      {
        tags: ["getAllParty"],
      }
    )();

    return parties;
  } catch (error) {
    console.error("Error fetching parties:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}
