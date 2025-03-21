import { Metadata } from "next";
import FarmerSalesForm from "./farmer-sales-form";
// import { getFarmers } from "@/lib/data/farmers";
// import { getProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Sell to Farmer | ChitraguptG",
  description:
    "Sell fertilizers, insecticides, pesticides and seeds to farmers",
};

export default async function FarmerSalesPage() {
  // Fetch farmers and products data
  const farmers = await prisma.party.findMany({
    where: {
      partyType: "FARMER",
    },
  });
  const products = await prisma.product.findMany();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sell to Farmer</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline">View Sales History</button>
          <button className="btn btn-primary">New Sale</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <FarmerSalesForm farmers={farmers} products={products} />
      </div>
    </div>
  );
}
