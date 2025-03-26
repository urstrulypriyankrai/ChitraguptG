import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeading from "@/app/_components/PageHeading";
import AddPaymentForm from "./add-payment-form";

export const metadata: Metadata = {
  title: "Add Payment | ChitraguptG",
  description: "Record a new payment from a farmer or retailer",
};

export default async function AddPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ farmerId?: string; retailerId?: string }>;
}) {
  const { farmerId, retailerId } = await searchParams;
  const partyId = farmerId || retailerId;
  const partyType = farmerId ? "FARMER" : retailerId ? "RETAILER" : undefined;

  return (
    <div className="container mx-auto py-6">
      <PageHeading heading="Record New Payment" />

      <div className="max-w-2xl mx-auto mt-6">
        <Suspense fallback={<div>Loading payment form...</div>}>
          <AddPaymentForm
            initialPartyId={partyId}
            initialPartyType={partyType}
          />
        </Suspense>
      </div>
    </div>
  );
}
