import type { Metadata } from "next";
import RetailerSalesForm from "./retailer-sales-form";
// import getAllParty from "@/actions/GET/getAllParty";
import getALlProducts from "@/actions/GET/getAllProducts";
import PageHeading from "@/app/_components/PageHeading";
import { ProductType } from "@/lib/types/Product/product";
import getAllParty from "@/actions/GET/getAllParty";

export const metadata: Metadata = {
  title: "Sell to Retailer | ChitraguptG",
  description:
    "Sell fertilizers, insecticides, pesticides and seeds to retailers",
};

export default async function RetailerSalesPage() {
  await fetch(process.env.BASE_URL + "/api/revalidate?tag=getAllParty");
  // Fetch retailers and products data
  const retailers = await getAllParty({
    where: {
      partyType: "SUPPLIER",
    },
    include: {
      address: true,
    },
  });

  const products = (await getALlProducts({
    include: {
      variants: true,
      tax: true,
    },
  })) as unknown as ProductType[];

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
