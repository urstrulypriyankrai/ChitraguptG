import type { Metadata } from "next";
import FarmerSalesForm from "./farmer-sales-form";
import getAllParty from "@/actions/GET/getAllParty";
import PageHeading from "@/app/_components/PageHeading";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sell to Farmer | ChitraguptG",
  description:
    "Sell fertilizers, insecticides, pesticides and seeds to farmers",
};

export default async function FarmerSalesPage() {
  await fetch(process.env.BASE_URL + "/api/revalidate?tag=getAllParty");
  // Fetch farmers and products data
  const farmers = await getAllParty({
    where: {
      partyType: "FARMER",
    },
    include: {
      address: true,
     
    },
  });

  const allProducts = await fetch(process.env.BASE_URL + "/api/product");
  const res = await allProducts.json();

  return (
    <div className="container mx-auto py-4">
      <PageHeading heading="Sell to Farmer" />
      <div className="flex justify-end items-center mb-4">
        <a href="/sales/history/farmer" className="mr-2">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
            View Sales History
          </button>
        </a>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6">
        <Suspense fallback={<p>loading...</p>}>
          <FarmerSalesForm farmers={farmers || []} products={res || []} />
        </Suspense>
      </div>
    </div>
  );
}
