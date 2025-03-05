import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"; // Import zod for validation

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .transform((val) => val.toUpperCase()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.errors },
        { status: 400 }
      );
    }
    const { name } = validation.data;

    const existingCategory = await prisma.productCategory.findFirst({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 }
      );
    }

    const newCategory = await prisma.productCategory.create({
      data: { name },
    });
    revalidateTag("productCategory");
    revalidatePath("/admin/product/manageCategory");

    return NextResponse.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error); // Enhanced logging

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to create category: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// ================== GET =============================
export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: {
        name: "asc", // Optional: Order categories by name (ascending)
      },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to fetch categories: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
