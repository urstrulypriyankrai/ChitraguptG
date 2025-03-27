import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = await req.nextUrl;
    const partyId = await searchParams.get("partyId");
    const startDate = await searchParams.get("startDate");
    const endDate = await searchParams.get("endDate");

    const whereClause: Record<string, unknown> = {
      type: "RETURN",
    };

    if (partyId) {
      whereClause.partyId = partyId;
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const returns = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        party: {
          include: {
            address: true,
          },
        },
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(returns);
  } catch (error) {
    console.error("Error fetching returns:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch returns",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data);

    // Validate required fields
    if (!data.partyId || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the return in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Generate return number
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      const returnNumber = `RET${year}${month}${day}${random}`;

      // // 2. Create the return record
      // const returnTransaction = await tx.transaction.create({
      //   data: {
      //     transactionNumber: returnNumber,
      //     type: "RETURN",
      //     partyId: data.partyId,
      //     totalAmount: data.totalAmount,
      //     paymentMethod: data.paymentMethod || "CASH",
      //     status: data.status || "COMPLETED",
      //     date: data.date ? new Date(data.date) : new Date(),
      //   },
      // });

      // 3. Create return items
      await tx.transactionItem.createMany({
        data: data.items.map((item) => ({
          transactionId: uuid(),
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          gstRate: item.gstRate,
          taxAmount: item.taxAmount,
        })),
      });

      // 4. Update inventory (add stock back)
      await Promise.all(
        data.items.map(
          async (item: { variantId: string; quantity: number }) => {
            const variant = await tx.productVariant.findUnique({
              where: { id: item.variantId },
            });

            if (variant) {
              const currentStock = variant.inStock || 0;
              const newStock = currentStock + Number(item.quantity);

              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { inStock: newStock },
              });

              // Create stock history entry
              await tx.stockHistory.create({
                data: {
                  productId: item.productId,
                  variantId: item.variantId,
                  quantity: item.quantity,
                  type: "ADD",
                  reason: `Return from ${data.partyType.toLowerCase()} - ${returnNumber}`,
                  partyId: data.partyId,
                  referenceTransactionId: returnTransaction.id,
                },
              });
            }
          }
        )
      );

      // 5. Create a ledger entry for the return
      if (data.updateLedger) {
        await tx.ledger.create({
          data: {
            partyId: data.partyId,
            amount: data.totalAmount,
            type: "CREDIT", // Return reduces the credit balance
            date: data.date ? new Date(data.date) : new Date(),
            description: `Product return: ${returnNumber}`,
            transactionId: returnTransaction.id,
          },
        });

        // 6. Update party credit balance
        const party = await tx.party.findUnique({
          where: { id: data.partyId },
        });

        if (party) {
          const currentCredit = party.creditBalance || 0;
          const newCredit = Math.max(
            0,
            currentCredit - Number(data.totalAmount)
          );

          await tx.party.update({
            where: { id: data.partyId },
            data: { creditBalance: newCredit },
          });
        }
      }

      return { returnTransaction, returnItems };
    });

    // Revalidate relevant paths
    revalidatePath("/returns");
    revalidatePath("/ledger");
    revalidatePath(`/ledger/farmer/${data.partyId}`);
    revalidatePath(`/ledger/retailer/${data.partyId}`);

    return NextResponse.json(result.returnTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating return:", error);
    return NextResponse.json(
      {
        message: "Failed to create return",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
