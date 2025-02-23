import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { checkDataValidation } from "../_utils/CheckDataValidation";

export async function GET(request: NextRequest) {
  console.log(request);
  const allParty = await prisma.party.findMany();

  return Response.json({
    message: "hi",
    party: allParty,
  });
}

/*
@POST
*/
export async function POST(request: NextRequest) {
  try {
    const data = await request.json(); //extract data from req

    const farmerValidation = checkDataValidation(farmerSchema, data);
    // console.log(farmerValidation.error);
    if (!farmerValidation.success)
      return Response.json(
        { message: "data Validataion failed" },
        { status: 500 }
      );

    // check if user is already present
    const isUserAlreadyPresent = await prisma.farmer.findMany({
      where: {
        name: data.partyName,
        fathersName: data.fathersName,
        village: data.village,
      },
    });

    // console.log(isUserAlreadyPresent, "present users");

    if (isUserAlreadyPresent.length > 0) {
      return Response.json(
        { message: "User already present" },
        { status: 400 }
      ); // Use 400 for bad request
    }

    // if user not present create a farmer
    const newFarmer = await prisma.farmer.create({
      data: {
        name: data.partyName,
        fathersName: data.fathersName,
        village: data.village,
        state: data.state,
        zip: parseInt(data.zipCode),
        mobile: data.mobile,
      },
    });

    // return response success!
    return Response.json(
      {
        success: true,
        data: JSON.stringify(newFarmer),
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("POST /api/farmer post:", error.message);
      return Response.json(
        { message: `User Not created!, ${error?.message}` },
        { status: 500 }
      );
    }
  }
}

const farmerSchema = z.object({
  partyName: z.string().min(3),
  fathersName: z.string().min(3),
  village: z.string().min(3),
  state: z.string().min(3),
  zipCode: z.string().length(6),
  mobile: z.string().min(10).max(13),
});
