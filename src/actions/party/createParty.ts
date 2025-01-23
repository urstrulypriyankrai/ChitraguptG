"use server";
import prisma from "@/lib/prisma";
import { PartyType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createParty(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as PartyType;
  const contact = formData.get("contact") as string;
  const address = formData.get("address") as string;
  const gstNumber = formData.get("gstNumber") as string;

  await prisma.party.create({
    data: {
      name,
      type,
      contact,
      address,
      gstNumber,
    },
  });
  revalidatePath("/inventory/party");
  console.log("Form action called data created");
}
