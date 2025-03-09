"use server";

import { revalidateTag } from "next/cache";

export async function revalidateProductUnits() {
  // revalidatePath("/admin/product/manageCategory");
  revalidateTag("productUnits");
}
