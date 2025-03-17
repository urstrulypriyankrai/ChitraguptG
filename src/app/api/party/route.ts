import { NextRequest } from "next/server";
import { partySchema } from "@/lib/ZodSchema/partySchema";
import prisma from "@/lib/prisma";
import { checkDataValidation } from "../_utils/CheckDataValidation";

export async function GET() {
  // console.log(request);
  const allParty = await prisma.party.findMany();

  return Response.json({
    messager: "hi",
    party: allParty,
  });
}

export async function POST(request: NextRequest) {
  try {
    // get the data
    const data = await request.json();
    const productId = String(
      (await data.aadhar) ? data.aadhar : data.gstNumber
    );
    // check validation
    const partyValidation = checkDataValidation(partySchema, data);

    // if validation falils
    if (!partyValidation.success)
      return Response.json(
        { message: "Data Validation Failed , Unable to create party" },
        { status: 500 }
      );

    // check if user already present
    const isUserAlreadyPresent = await prisma.party.findMany({
      where: {
        gstNumber: data.gstNumber,
        NOT: {
          partyType: "FARMER",
        },
      },
    });

    // if user exist return error
    if (isUserAlreadyPresent.length)
      return Response.json(
        { message: "Party already exist " },
        { status: 500 }
      );

    // if everything is fine
    const newParty = await prisma.party.create({
      data: {
        id: productId,
        name: data.partyName,
        partyType: data.partyType,
        email: data.email,
        mobile: data.mobile,
        gstNumber: data.gstNumber,
        address: {
          create: {
            street: data.street,
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

    if (newParty.id) {
      return Response.json(
        {
          message: `✅${data.partyName} Created Successfully !`,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return Response.json(
        {
          message: `❌ Unable to create party! something went wrong !`,
        },
        { status: 500 }
      );
    }
  }
}
