import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.taxInformation?.hsnCode || !body.category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Handle Tax record
      const tax = await tx.tax.upsert({
        where: { hsnCode: body.taxInformation.hsnCode },
        create: {
          hsnCode: body.taxInformation.hsnCode,
          gstRate: body.taxInformation.gstRate,
        },
        update: {},
      });

      // 2. Handle Product Category
      await tx.productCategory.upsert({
        where: { name: body.category },
        create: { name: body.category },
        update: {},
      });

      // 3. Create Main Product
      const newProduct = await tx.product.create({
        data: {
          name: body.name,
          description: body.description,
          productCategoryName: body.category,
          taxHsnCode: tax.hsnCode,
          lowStockThreshold: body.lowStockThreshold,
        },
      });

      return newProduct;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API POST error:", error);
    return NextResponse.json(
      {
        message: "Failed to create product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
