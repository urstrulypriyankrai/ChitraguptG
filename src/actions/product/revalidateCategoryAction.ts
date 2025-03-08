"use server";

import { revalidateTag } from "next/cache";

export async function revalidateCategoryAction() {
  // revalidatePath("/admin/product/manageCategory");
  revalidateTag("productCategory");
}
