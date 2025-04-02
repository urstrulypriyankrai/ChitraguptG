import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  const tag = (await request.nextUrl.searchParams.get("tag")) || "";
  console.log("revalidation tag", tag);
  revalidateTag(tag);
  return Response.json({ revalidated: true, now: Date.now() });
}
