"use server";
import prisma from "@/lib/prisma";
import { PartyType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createParty(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as PartyType;
  const mobile = formData.get("mobile") as string;
  const email = formData.get("email") as string;
  const gstNumber = formData.get("gstNumber") as string;
  // const street = formData.get("street") as string;
  // const district = formData.get("district") as string;
  // const state = formData.get("state") as string;

  await prisma.party.create({
    data: {
      name,
      type,
      mobile,
      email,
      gstNumber,
    },
  });
  revalidatePath("/inventory/party");
  console.log("Form action called data created");
}
