import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
export async function GET(request: NextRequest) {
  const allParty = await prisma.party.findMany();

  return Response.json({
    messager: "hi",
    party: allParty,    
  });
}

export async function POST(request: NextRequest) {}
