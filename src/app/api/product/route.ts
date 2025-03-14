import prisma from "@/lib/prisma";
import { ProductVariantType } from "@/lib/types/Product/ProductVariantType";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", body);
    const productUUID = uuid();
    const productVariantArray = body?.variants.map(
      (variant: ProductVariantType) => ({
        ...variant,
        id: uuid(),
        productId: productUUID,
      })
    );

    const result = await prisma.$transaction(async (tx) => {
      try {
        // 1. Handle Tax record
        const tax = await tx.tax.upsert({
          where: { hsnCode: body.taxInformation.hsnCode },
          create: {
            hsnCode: body.taxInformation.hsnCode,
            gstRate: body.taxInformation.gstRate,
          },
          update: {},
        });
        console.log("Tax record upserted:", tax);

        // 2. Handle Product Category
        const category = await tx.productCategory.upsert({
          where: { name: body.category },
          create: { name: body.category },
          update: {},
        });
        console.log("Product category upserted:", category);

        // 3. Create Main Product
        const newProduct = await tx.product.create({
          data: {
            id: productUUID,
            name: body.name,
            description: body.description,
            productCategoryName: body.category,
            taxHsnCode: tax.hsnCode,
            lowStockThreshold: body.lowStockThreshold,
          },
        });
        console.log("New product created:", newProduct);

        // 4. Link Supplier
        const supplierLink = await tx.productSupplier.upsert({
          where: {
            productId_supplierId: {
              productId: productUUID,
              supplierId: parseInt(body.supplier.id),
            },
          },
          create: {
            productId: productUUID,
            supplierId: parseInt(body.supplier.id),
          },
          update: {},
        });
        console.log("Supplier linked:", supplierLink);

        // 5. Create Variants (Simplified for debugging)
        const variantRef = await tx.productVariant.createMany({
          data: productVariantArray,
        });

        // Return complete product data (Simplified for debugging)
        const productWithDetails = await tx.product.findUnique({
          where: { id: newProduct.id },
          // include: { // Temporarily removed include
          //   variants: true,
          //   ProductSupplier: {
          //     include: { supplier: true },
          //   },
          // },
        });
        console.log("Product with details:", productWithDetails);
        return productWithDetails;
      } catch (transactionError) {
        console.error("Error within transaction:", transactionError);
        return null;
      }
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
