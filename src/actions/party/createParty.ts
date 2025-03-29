"use server";
import prisma from "@/lib/prisma";
import { PartyType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function createParty(formData: FormData) {
  const name = formData.get("name") as string;
  const partyType = formData.get("partyType") as PartyType;
  const mobile = formData.get("mobile") as string;
  const email = formData.get("email") as string;
  const gstNumber = formData.get("gstNumber") as string;

  const party = await prisma.party.create({
    data: {
      name,
      partyType,
      mobile,
      email,
      gstNumber,
    },
  });
  revalidatePath("/inventory/party");
  await fetch("/api/revalidate?tag=getAllParty");
  return NextResponse.json(
    {
      success: true,
      data: party,
    },
    {
      status: 200,
    }
  );
}
