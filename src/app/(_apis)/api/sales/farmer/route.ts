import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GSTRATE } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data, "receeived in server");

    // Validate required fields
    if (!data.farmerId || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Inside POST handler, after initial validation
    const farmerExists = await prisma.party.findUnique({
      where: { id: data.farmerId },
    });
    if (!farmerExists) {
      return NextResponse.json(
        { message: "Farmer not found" },
        { status: 404 }
      );
    }

    // Validate products and variants
    for (const item of data.items) {
      const [product, variant] = await Promise.all([
        prisma.product.findUnique({ where: { id: item.productId } }),
        prisma.productVariant.findUnique({ where: { id: item.variantId } }),
      ]);
      if (!product || !variant) {
        return NextResponse.json(
          { message: "Invalid product or variant in items" },
          { status: 400 }
        );
      }
      if (product.inStock < item.quantity) {
        console.log(product.inStock);
        return NextResponse.json(
          { message: "Insufficient stock for variant" },
          { status: 400 }
        );
      }
    }

    // Create the sale in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the sale record
      const sale = await tx.farmerSale.create({
        data: {
          billNumber: data.billNumber,
          billDate: new Date(data.billDate),
          farmerId: data.farmerId,
          totalAmount: data.totalAmount,
          amountPaid: data.amountPaid,
          balance: data.balance,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          status: data.status,
        },
      });

      // 2. Create sale items
      const saleItems = await Promise.all(
        data.items.map(async (item: SaleItem) => {
          return tx.farmerSaleItem.create({
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
          });
        })
      );

      // 3. Update inventory (reduce stock)
      await Promise.all(
        data.items.map(async (item: SaleItem) => {
          const product = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });
          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              inStock: {
                decrement: item.quantity,
              },
            },
          });

          if (product) {
            const currentStock = product.inStock || 0;
            const newStock = Math.max(0, currentStock - item.quantity);

            return await tx.productVariant.update({
              where: { id: item.variantId },
              data: { inStock: newStock },
            });
          }
        })
      );

      // 4. Create ledger entry for the total sale amount (DEBIT)
      await tx.ledger.create({
        data: {
          partyId: data.farmerId,
          amount: data.totalAmount,
          type: "DEBIT", // Farmer owes the total amount
          description: `Sale for bill #${data.billNumber}`,
          date: new Date(),
          referenceId: sale.id,
          referenceType: "FARMER_SALE",
        },
      });

      // Update farmer's credit balance with the totalAmount
      const farmer = await tx.party.findUnique({
        where: { id: data.farmerId },
      });

      if (farmer) {
        const currentCredit = farmer.creditBalance || 0;
        await tx.party.update({
          where: { id: data.farmerId },
          data: { creditBalance: currentCredit + data.totalAmount },
        });
      }

      // 5. If there's a payment, create payment record and CREDIT ledger entry
      if (data.amountPaid > 0) {
        await tx.payment.create({
          data: {
            partyId: data.farmerId,
            amount: data.amountPaid,
            method: data.paymentMethod,
            date: new Date(data.billDate),
            description: `Payment for bill #${data.billNumber}`,
            referenceId: sale.id,
            referenceType: "FARMER_SALE",
          },
        });

        // CREDIT entry for the payment
        await tx.ledger.create({
          data: {
            partyId: data.farmerId,
            amount: data.amountPaid,
            type: "CREDIT", // Payment reduces the owed amount
            description: `Payment for bill #${data.billNumber}`,
            date: new Date(data.billDate),
            referenceId: sale.id,
            referenceType: "FARMER_SALE",
          },
        });

        // Deduct the payment from the farmer's credit balance
        const updatedFarmer = await tx.party.findUnique({
          where: { id: data.farmerId },
        });

        if (updatedFarmer) {
          const currentCreditAfterSale = updatedFarmer.creditBalance || 0;
          await tx.party.update({
            where: { id: data.farmerId },
            data: { creditBalance: currentCreditAfterSale - data.amountPaid },
          });
        }
      }
      return { sale, saleItems };
    });

    // Revalidate relevant paths
    revalidatePath("/sales/history/farmer");
    revalidatePath("/ledger/farmer");
    revalidatePath("/inventory");

    return NextResponse.json(result.sale, { status: 201 });
  } catch (error) {
    console.error("Error creating farmer sale:", error);
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
    const farmerId = searchParams.get("farmerId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereClause: Record<string, unknown> = {};

    if (farmerId) {
      whereClause.farmerId = farmerId;
    }

    if (startDate && endDate) {
      whereClause.billDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const sales = await prisma.farmerSale.findMany({
      where: whereClause,
      include: {
        farmer: {
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
    let errorMessage = "Failed to create sale";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else {
      errorMessage += ": Unknown error";
    }
    console.error(errorMessage); // Log the composed message instead of the error object
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
interface SaleItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  discount: number;
  gstRate: GSTRATE;
  hsnCode: string;
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  total: number;
}
