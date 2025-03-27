import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeading from "@/app/_components/PageHeading";
import ReturnsList from "./returns-list";

export const metadata: Metadata = {
  title: "Product Returns | ChitraguptG",
  description: "Manage product returns from farmers and retailers",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeading heading="Product Returns" />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Returns</TabsTrigger>
          <TabsTrigger value="farmer">Farmer Returns</TabsTrigger>
          <TabsTrigger value="retailer">Retailer Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ReturnsList filter="all" />
        </TabsContent>

        <TabsContent value="farmer">
          <ReturnsList filter="FARMER" />
        </TabsContent>

        <TabsContent value="retailer">
          <ReturnsList filter="RETAILER" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
