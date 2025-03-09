import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"; // Import Zod for validation

// Validation schema
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .transform((val) => val.toUpperCase()),
});

// Helper function to check if a category exists (case-insensitive)
const isThisExistingCategory = async (name: string) => {
  const existingCategory = await prisma.productCategory.findFirst({
    where: {
      name,
    },
  });
  return !!existingCategory;
};

// ================== POST: Create Category =============================
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

    if (await isThisExistingCategory(name)) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 }
      );
    }

    const newCategory = await prisma.productCategory.create({ data: { name } });

    // Revalidate cache
    revalidateTag("productCategory");
    revalidatePath("/admin/product/manageCategory");

    return NextResponse.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);

    return NextResponse.json(
      {
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

// ================== GET: Fetch Categories =============================
export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch categories",
        error: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

// =========== PATCH: Update Category Name =============================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { prevName, newName } = body;

    const validation = categorySchema.safeParse({ name: newName });

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.errors },
        { status: 400 }
      );
    }

    if (await isThisExistingCategory(newName)) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 }
      );
    }

    const updatedCategory = await prisma.productCategory.update({
      where: { name: prevName },
      data: { name: newName.toUpperCase() },
    });

    return NextResponse.json(
      { message: "Category updated successfully", category: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);

    return NextResponse.json(
      {
        message: "Unable to update category",
        error: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

// =========== DELETE: Remove Category =============================
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.productCategory.findFirst({
      where: { name },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    await prisma.productCategory.delete({
      where: { name },
    });

    // Revalidate cache
    revalidateTag("productCategory");
    revalidatePath("/admin/product/manageCategory");

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);

    return NextResponse.json(
      {
        message: "Unable to delete category",
        error: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}
