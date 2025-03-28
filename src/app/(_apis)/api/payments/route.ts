import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const partyId = searchParams.get("partyId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    console.log(partyId);
    const whereClause: Record<string, unknown> = {};

    if (partyId) {
      whereClause.partyId = partyId;
    }

    if (startDate && endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: endDateObj,
      };
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        party: {
          include: {
            address: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    console.log(payments);
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch payments",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      partyId,
      amount,
      method,
      date,
      reference,
      description,
      referenceType,
      referenceId,
    } = body;

    // Validate required fields
    if (!partyId || !amount || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use a transaction for all database operations
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get the party to update credit balance
      const party = await tx.party.findUnique({
        where: { id: partyId },
      });

      if (!party) {
        throw new Error("Party not found");
      }

      // 2. Create the payment
      const payment = await tx.payment.create({
        data: {
          partyId,
          amount,
          method,
          date: date ? new Date(date) : new Date(),
          reference,
          description,
          referenceType,
          referenceId,
        },
      });

      // 3. Create a ledger entry for this payment
      const ledgerEntry = await tx.ledger.create({
        data: {
          partyId,
          amount,
          type: method || "CREDIT", // Payment is a credit to the party's account
          date: payment.date,
          description: description || `Payment: ${reference || payment.id}`,
          paymentId: payment.id,
          referenceType: "PAYMENT",
          referenceId: payment.id,
        },
      });

      // 4. Update the party's credit balance
      const updatedParty = await tx.party.update({
        where: { id: partyId },
        data: {
          creditBalance: {
            decrement: Number.parseFloat(amount.toString()),
          },
        },
      });

      return { payment, ledgerEntry, updatedParty };
    });

    // Revalidate relevant paths
    revalidatePath("/payments");
    revalidatePath("/ledger");
    revalidatePath(`/ledger/farmer/${partyId}`);
    revalidatePath(`/ledger/retailer/${partyId}`);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      {
        error: "Failed to create payment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
