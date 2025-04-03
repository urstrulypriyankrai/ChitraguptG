import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SaleItem } from "@/lib/types/sales";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.retailerId || !data.items?.length) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate derived values
    const balance = data.totalAmount - data.amountPaid;
    const paymentStatus =
      balance === 0 ? "PAID" : data.amountPaid > 0 ? "PARTIAL" : "PENDING";

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the sale record
      const sale = await tx.retailerSale.create({
        data: {
          billNumber: data.billNumber,
          billDate: new Date(data.billDate),
          retailerId: data.retailerId,
          totalAmount: data.totalAmount,
          amountPaid: data.amountPaid,
          balance: balance,
          paymentMethod: data.paymentMethod,
          paymentStatus: paymentStatus,
          status: "COMPLETED",
        },
      });

      // 2. Create sale items
      const saleItems = await Promise.all(
        data.items.map((item: SaleItem) =>
          tx.retailerSaleItem.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount,
              gstRate: item.gstRate,
              hsnCode: item.hsnCode,
              subtotal: item.subtotal,
              discountAmount: item.discountAmount,
              gstAmount: item.gstAmount,
              total: item.total,
            },
          })
        )
      );

      // 3. Update inventory (atomic operations)
      await Promise.all(
        data.items.map(async (item: SaleItem) => {
          await tx.product.update({
            where: { id: item.productId },
            data: { inStock: { decrement: item.quantity } },
          });
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { inStock: { decrement: item.quantity } },
          });
        })
      );

      // 4. Handle accounting entries
      const retailer = await tx.party.findUnique({
        where: { id: data.retailerId },
      });

      if (!retailer) throw new Error("Retailer not found");

      // Update credit balance with total amount
      await tx.party.update({
        where: { id: data.retailerId },
        data: { creditBalance: { increment: data.totalAmount } },
      });

      // Create initial DEBIT entry
      await tx.ledger.create({
        data: {
          partyId: data.retailerId,
          amount: data.totalAmount,
          type: "DEBIT",
          description: `Sale for bill #${data.billNumber}`,
          date: new Date(),
          referenceId: sale.id,
          referenceType: "RETAILER_SALE",
        },
      });

      // Handle payments
      if (data.amountPaid > 0) {
        // Create payment record
        await tx.payment.create({
          data: {
            partyId: data.retailerId,
            amount: data.amountPaid,
            method: data.paymentMethod,
            date: new Date(data.billDate),
            description: `Payment for bill #${data.billNumber}`,
            referenceId: sale.id,
            referenceType: "RETAILER_SALE",
          },
        });

        // Update credit balance
        await tx.party.update({
          where: { id: data.retailerId },
          data: { creditBalance: { decrement: data.amountPaid } },
        });

        // Create CREDIT entry
        await tx.ledger.create({
          data: {
            partyId: data.retailerId,
            amount: data.amountPaid,
            type: "CREDIT",
            description: `Payment for bill #${data.billNumber}`,
            date: new Date(data.billDate),
            referenceId: sale.id,
            referenceType: "RETAILER_SALE",
          },
        });
      }

      return { sale, saleItems };
    });

    // Revalidate paths
    revalidatePath("/sales/history/retailer");
    revalidatePath("/ledger/retailer");
    revalidatePath("/inventory");

    return NextResponse.json(result.sale, { status: 201 });
  } catch (error) {
    console.error("Error creating retailer sale:", error);
    return NextResponse.json(
      {
        message: "Failed to create sale",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const retailerId = searchParams.get("retailerId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereClause: Record<string, unknown> = {};

    if (retailerId) {
      whereClause.retailerId = retailerId;
    }

    if (startDate && endDate) {
      whereClause.billDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const sales = await prisma.retailerSale.findMany({
      where: whereClause,
      include: {
        retailer: {
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
        billDate: "desc",
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching retailer sales:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch sales",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
