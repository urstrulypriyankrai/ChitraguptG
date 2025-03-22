import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // First try to find a farmer sale
    const farmerSale = await prisma.farmerSale.findUnique({
      where: { id: parseInt(id) },
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
    });

    if (farmerSale) {
      return NextResponse.json({
        ...farmerSale,
        type: "FARMER_SALE",
      });
    }

    // If not found, try to find a retailer sale
    const retailerSale = await prisma.retailerSale.findUnique({
      where: { id: parseInt(id) },
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
    });

    if (retailerSale) {
      return NextResponse.json({
        ...retailerSale,
        type: "RETAILER_SALE",
      });
    }

    // If neither found, return 404
    return NextResponse.json({ message: "Bill not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch bill",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
