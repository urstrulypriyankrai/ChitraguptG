import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { checkDataValidation } from "../_utils/CheckDataValidation";
import { farmerSchema } from "@/lib/ZodSchema/farmerSchema";

export async function GET() {
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

    if (isUserAlreadyPresent.length > 0) {
      return Response.json(
        { message: "User already present" },
        { status: 400 }
      ); // Use 400 for bad request
    }

    // if user not present create a farmer
    const newFarmer = await prisma.party.create({
      data: {
        id: String(farmerValidation.data.aadhar),
        partyType: farmerValidation.data.partyType,
        name: farmerValidation.data.partyName,
        fathersName: farmerValidation.data.fathersName,
        aadhar: farmerValidation.data.aadhar,
        mobile: farmerValidation.data.mobile,
        address: {
          create: {
            village: farmerValidation.data.village,
            district: farmerValidation.data.district,
            state: farmerValidation.data.state,
            zip: farmerValidation.data.zipCode,
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
