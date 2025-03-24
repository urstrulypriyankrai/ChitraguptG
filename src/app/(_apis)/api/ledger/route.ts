import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const partyId = searchParams.get("partyId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type") as "DEBIT" | "CREDIT" | null;
    const referenceType = searchParams.get("referenceType");

    const whereClause: Record<string, unknown> = {};

    if (partyId) {
      whereClause.partyId = partyId;
    }

    if (type) {
      whereClause.type = type;
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (referenceType) {
      whereClause.referenceType = referenceType;
    }

    const ledgerEntries = await prisma.ledger.findMany({
      where: whereClause,
      include: {
        party: {
          include: {
            address: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    console.log("ledger enteries", ledgerEntries);
    return NextResponse.json(ledgerEntries);
  } catch (error) {
    console.error("Error fetching ledger entries:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch ledger entries",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.partyId || !data.amount || !data.type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the ledger entry
    const ledgerEntry = await prisma.ledger.create({
      data: {
        partyId: data.partyId,
        amount: data.amount,
        type: data.type,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
        transactionId: data.transactionId,
      },
    });

    // Update party credit balance
    if (data.updateBalance) {
      const party = await prisma.party.findUnique({
        where: { id: data.partyId },
      });

      if (party) {
        const currentCredit = party.creditBalance || 0;
        const newCredit =
          data.type === "DEBIT"
            ? currentCredit + Number(data.amount)
            : currentCredit - Number(data.amount);

        await prisma.party.update({
          where: { id: data.partyId },
          data: { creditBalance: Math.max(0, newCredit) },
        });
      }
    }

    // Revalidate relevant paths
    revalidatePath("/ledger");
    revalidatePath(`/ledger/farmer/${data.partyId}`);
    revalidatePath(`/ledger/retailer/${data.partyId}`);

    return NextResponse.json(ledgerEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating ledger entry:", error);
    return NextResponse.json(
      {
        message: "Failed to create ledger entry",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
