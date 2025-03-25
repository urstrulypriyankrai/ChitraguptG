"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

export default async function getAllLedger(
  options: Prisma.LedgerFindManyArgs = {}
) {
  try {
    const data = await unstable_cache(
      async () => {
        return prisma.ledger.findMany(options);
      },
      ["getAllLedger"],
      {
        tags: ["getAllLedger"],
      }
    )();

    return data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}
