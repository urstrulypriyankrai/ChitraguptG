import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeading from "@/app/_components/PageHeading";
import AddReturnForm from "./add-return-form";

export const metadata: Metadata = {
  title: "Add Product Return | ChitraguptG",
  description: "Process a product return from a farmer or retailer",
};

export default async function AddReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ farmerId?: string; retailerId?: string }>;
}) {
  const { farmerId, retailerId } = await searchParams;
  const partyId = farmerId || retailerId;
  const partyType = farmerId ? "FARMER" : retailerId ? "RETAILER" : undefined;

  return (
    <div className="container mx-auto py-6">
      <PageHeading heading="Process Product Return" />

      <div className="max-w-4xl mx-auto mt-6">
        <Suspense fallback={<div>Loading return form...</div>}>
          <AddReturnForm
            initialPartyId={partyId}
            initialPartyType={partyType}
          />
        </Suspense>
      </div>
    </div>
  );
}
