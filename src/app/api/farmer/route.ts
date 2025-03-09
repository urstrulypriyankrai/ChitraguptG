import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { checkDataValidation } from "../_utils/CheckDataValidation";
import { farmerSchema } from "@/lib/ZodSchema/farmerSchema";

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
    const isUserAlreadyPresent = await prisma.party.findMany({
      where: {
        aadhar: data.aadhar,
        partyType: data.partyType,
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
    const newFarmer = await prisma.party.create({
      data: {
        partyType: data.partyType,
        name: data.partyName,
        fathersName: data.fathersName,
        aadhar: data.aadhar,
        mobile: data.mobile,
        address: {
          create: {
            village: data.village,
            district: data.district,
            state: data.state,
            zip: data.zipCode,
          },
        },
      },
      include: {
        address: true,
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
