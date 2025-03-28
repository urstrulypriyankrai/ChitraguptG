import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { convertGstRateToString } from "@/lib/helpers/convertGstRateToNumber";
import { GSTRATE, ReturnItem } from "@prisma/client";

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
    console.log("Return data received:", data);
    let credit_note = 0;
    data.items.map((item) => {
      credit_note +=
        parseInt(item.price) -
        (parseInt(item.price) * parseInt(item.discountRate)) / 100;
    });

    // Validate required fields
    if (!data.partyId || !data.items || data.items.length === 0) {
      console.log("primary fields not provided");
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate that all required item fields have values
    for (const item of data.items) {
      if (
        !item.productId ||
        !item.variantId ||
        item.returnQuantity === undefined ||
        item.price === undefined ||
        item.gstRate === undefined
      ) {
        console.log("items detail missing");
        return NextResponse.json(
          {
            message: "Missing required item fields",
            item,
          },
          { status: 400 }
        );
      }

      // Ensure numeric values are not undefined
      item.returnQuantity = Number(item.returnQuantity) || 0;
      item.price = Number(item.price) || 0;
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

      // 2. Create the return record first
      const returnTransactionRef = await tx.return.create({
        data: {
          returnNumber: returnNumber,
          partyId: data.partyId,
          totalAmount: data.totalAmount,
          status: data?.status || "COMPLETED",
          returnDate: data.date ? new Date(data.date) : new Date(),
          BillNumber: data.BillNumber,
        },
      });

      // 3. Create transaction items separately
      await Promise.all(
        data.items.map(
          async (
            item: ReturnItem & {
              returnQuantity: number;
              gstRate: GSTRATE;
              price: number;
            }
          ) => {
            return await tx.returnItem.create({
              data: {
                quantity: Number(item.returnQuantity),
                price: Number(item.price),
                discount: item.discount,
                gstRate: convertGstRateToString(item.gstRate) as GSTRATE,

                return: {
                  connect: {
                    id: returnTransactionRef.id,
                  },
                },
                product: {
                  connect: {
                    id: item.productId,
                  },
                },
                variant: {
                  connect: {
                    id: item.variantId,
                  },
                },
                total: item?.price,
              },
            });
          }
        )
      );

      // 4. Update inventory (add stock back)
      const stockHistoryEntries = await Promise.all(
        data.items.map(async (item: any) => {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });

          const currentStock = variant?.inStock || 0;
          const newStock = currentStock - Number(item.returnQuantity);

          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { inStock: newStock },
          });

          // Create stock history entry
          return await tx.stockHistory.create({
            data: {
              quantity: newStock,
              type: "ADD",
              reason: `Return from ${data.partyId} - ${returnNumber}`,

              referenceTransactionId: returnTransactionRef.id,
              referenceType: "RETURN",
              product: {
                connect: {
                  id: item.productId,
                },
              },
              variant: {
                connect: { id: item.variantId },
              },
              party: {
                connect: {
                  id: data.partyId,
                },
              },
            },
          });
        })
      );

      const party = await prisma.party.findUnique({
        where: {
          id: data.partyId,
        },
      });
      const res = await fetch(process.env.BASE_URL + "/api/payments", {
        method: "POST",
        body: JSON.stringify({
          partyId: data.partyId,
          amount: credit_note,
          method: "CREDIT_NOTE",
          date: data.date ? new Date(data.date) : new Date(),
          reference: `CREDIT_NOTE FOR  ${party?.name}`,
          description: `RETURN FOR  ${party?.name}`,
          referenceType: "RETURN",
        }),
      });
      if (!res.ok) throw new Error("unable to complete payment");

      return {
        stockHistoryEntries,
        // payment,
        // ledgerEntry,
        // updatedParty,
      };
    });

    // Revalidate relevant paths
    revalidatePath("/returns");
    revalidatePath("/ledger");
    revalidatePath(`/ledger/farmer/${data.partyId}`);
    revalidatePath(`/ledger/retailer/${data.partyId}`);

    return NextResponse.json(result, { status: 201 });
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
