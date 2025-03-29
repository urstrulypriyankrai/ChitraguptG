import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"; // Import Zod for validation

// Validation schema
const unitSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .transform((val) => val.toUpperCase()),
});

// Helper function to check if a unit exists (case-insensitive)
const isThisExistingUnit = async (name: string) => {
  const existingUnit = await prisma.productUnit.findFirst({
    where: {
      name,
    },
  });
  return !!existingUnit;
};

// ================== POST: Create Unit =============================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = unitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { name } = validation.data;

    if (await isThisExistingUnit(name)) {
      return NextResponse.json(
        { message: "Unit already exists" },
        { status: 409 }
      );
    }

    const newUnit = await prisma.productUnit.create({
      data: {
        name: name,
      },
    });

    // Revalidate cache
    revalidateTag("productUnit");
    // revalidatePath("/admin/product/manageUnit");

    return NextResponse.json(
      { message: "Unit created successfully", unit: newUnit },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating unit:", error);
      return NextResponse.json(
        {
          message: "An unexpected error occurred",
          error: error instanceof Error ? error.message : null,
        },
        { status: 500 }
      );
    }
  }
}

// ================== GET: Fetch Units =============================
export async function GET() {
  try {
    const units = await prisma.productUnit.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ units }, { status: 200 });
  } catch (error) {
    console.error("Error fetching units:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch units",
        error: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

// =========== PATCH: Update Unit Name =============================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { prevName, newName } = body;

    const validation = unitSchema.safeParse({ name: newName });

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.errors },
        { status: 400 }
      );
    }

    if (await isThisExistingUnit(newName)) {
      return NextResponse.json(
        { message: "Unit already exists" },
        { status: 409 }
      );
    }

    const updatedUnit = await prisma.productUnit.update({
      where: { name: prevName },
      data: { name: newName.toUpperCase() },
    });

    return NextResponse.json(
      { message: "Unit updated successfully", unit: updatedUnit },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating unit:", error);

    return NextResponse.json(
      {
        message: "Unable to update unit",
        error: error instanceof Error ? error.message : null,
      },
      { status: 500 }
    );
  }
}

// ================== DELETE: Delete Unit =============================
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    const existingUnit = await prisma.productUnit.findFirst({
      where: { name },
    });
    if (!existingUnit) {
      return NextResponse.json({ message: "Unit not found" }, { status: 404 });
    }

    await prisma.productUnit.delete({ where: { name } });
    revalidateTag("unit");
    revalidatePath("/admin/product/manageUnit");

    return NextResponse.json(
      { message: "Unit deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting unit:", error);
    if (error instanceof Error)
      return NextResponse.json(
        { message: "Unable to delete unit", error: error?.message },
        { status: 500 }
      );
  }
}
