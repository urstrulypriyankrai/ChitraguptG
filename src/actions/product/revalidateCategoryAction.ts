"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateCategoryAction() {
  revalidatePath("/admin/product/manageCategory");
  revalidateTag("productCategory");
}
