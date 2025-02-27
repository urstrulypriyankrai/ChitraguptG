import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest) {
  const { searchParams } = new URL(`${req.url}`);
  const hsnCode = searchParams.get("hsnCode");
  console.log(searchParams);
  const data = await prisma.tax.findMany({
    where: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      hsnCode: hsnCode,
    },
  });
  return Response.json(
    {
      data,
    },
    { status: 200 }
  );
}
