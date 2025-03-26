import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hasCredit = searchParams.get("hasCredit");

    const whereClause: Record<string, unknown> = {
      partyType: "RETAILER",
    };

    if (hasCredit === "true") {
      whereClause.creditBalance = {
        gt: 0,
      };
    } else if (hasCredit === "false") {
      whereClause.creditBalance = 0;
    }

    const retailers = await prisma.party.findMany({
      where: whereClause,
      include: {
        address: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(retailers);
  } catch (error) {
    console.error("Error fetching retailers:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch retailers",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
