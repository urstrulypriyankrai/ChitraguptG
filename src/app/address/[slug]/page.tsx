import PageHeading from "@/app/_components/PageHeading";
import prisma from "@/lib/prisma";
import { AddressForm } from "./AddressForm";
import { auth } from "@/auth";
import { addressSchema } from "@/lib/ZodSchema/address/addressSchema";
import { z } from "zod";
import getAddress from "@/actions/GET/address/getAddress";
import { Address } from "@prisma/client";
import { revalidatePath } from "next/cache";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // handle
  const session = await auth();
  if (!session?.user || session?.user.role + "" !== "ADMIN")
    return <div>You are not authorized to edit</div>;

  const address: Address | null = await getAddress({
    where: {
      id: parseInt(slug),
    },
  });
  if (!address) {
    return <div>Address not found</div>;
  }

  // Convert null values to empty strings for form compatibility
  const formData = {
    ...address,
    street: address.street ?? "",
    village: address.village ?? "",
  };

  async function handleSubmit(data: z.infer<typeof addressSchema>) {
    "use server";
    // Add your form submission logic here
    // Convert empty strings back to null for Prisma
    const submissionData = {
      id: address?.id,
      ...data,
      street: data.street || null,
      village: data.village || null,
    };
    if (JSON.stringify(submissionData) === JSON.stringify(address)) {
      throw new Error("No changes detected - address information is identical");
    }

    try {
      // Proceed with update only if there are changes
      await prisma.address.update({
        where: { id: address?.id },
        data: submissionData,
      });

      await fetch(process.env.BASE_URL + "/api/revalidate?tag=getAllParty");
      await fetch(process.env.BASE_URL + "/api/revalidate?tag=getAddress");
      revalidatePath("/party/view");
      return { success: true, message: "Address updated successfully" };
    } catch (error) {
      console.error("Update error:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update address due to a server error"
      );
    }
  }

  return (
    <div className="space-y-8">
      <PageHeading heading="Edit Address" />
      <AddressForm defaultValue={formData} onSubmit={handleSubmit} />
    </div>
  );
}
