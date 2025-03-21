import type { Metadata } from "next";
import RetailerSalesForm from "./retailer-sales-form";
import getAllParty from "@/actions/GET/getAllParty";
import getALlProducts from "@/actions/GET/getAllProducts";
import PageHeading from "@/app/_components/PageHeading";

export const metadata: Metadata = {
  title: "Sell to Retailer | ChitraguptG",
  description:
    "Sell fertilizers, insecticides, pesticides and seeds to retailers",
};

export default async function RetailerSalesPage() {
  // Fetch retailers and products data
  const retailers = await getAllParty({
    where: {
      partyType: "RETAILER",
    },
    include: {
      address: true,
    },
  });

  const products = await getALlProducts({
    include: {
      variants: true,
      tax: true,
    },
  });

  return (
    <div className="container mx-auto py-4">
      <PageHeading heading="Sell to Retailer" />
      <div className="flex justify-end items-center mb-4">
        <a href="/sales/history/retailer" className="mr-2">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
            View Sales History
          </button>
        </a>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6">
        <RetailerSalesForm
          retailers={retailers || []}
          products={products || []}
        />
      </div>
    </div>
  );
}
