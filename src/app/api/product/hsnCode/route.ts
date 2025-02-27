import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(`${req.url}`);
    const hsnCode = searchParams.get("hsnCode");
    console.log(searchParams);
    const data = await prisma.tax.findFirst({
      where: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        hsnCode: hsnCode,
      },
    });

    return Response.json(
      {
        hsnCode: data?.hsnCode,
        gstRate: data?.gstRate,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error)
      return Response.json(
        {
          hsnCode: null,
          gstRate: null,
          message: err.message,
        },
        { status: 500 }
      );
  }
}
