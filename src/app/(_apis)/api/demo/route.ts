import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST() {
  try {
    const productUUID = "test-product-uuid"; // Use a static ID for testing
    const result = await prisma.$transaction(async (tx) => {
      try {
        const newVariant = await tx.productVariant.create({
          data: {
            id: uuid(),
            bags: 1,
            piecePerBag: 1,
            weight: 1,
            MRP: 1,
            unloading: 1,
            freightCharges: 1,
            inStock: 0,
            warehouseLocation: uuid(),
            quantityUnitName: "KG",
            productId: productUUID,
          },
        });
        return NextResponse.json({
          message: "Variant created",
          variant: newVariant,
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error creating variant:", error);
          return NextResponse.json(
            { message: "Failed to create variant", error: error?.message },
            { status: 500 }
          );
        }
      }
    });
    return result;
  } catch (error) {
    console.error("API POST error:", error);
    if (error instanceof Error)
      return NextResponse.json(
        { message: "API error", error: error.message },
        { status: 500 }
      );
  }
}
