import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeading from "@/app/_components/PageHeading";
import PaymentsList from "./payments-list";

export const metadata: Metadata = {
  title: "Payments | ChitraguptG",
  description: "View and manage payments from farmers and retailers",
};

export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeading heading="Payments Management" />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="farmer">Farmer Payments</TabsTrigger>
          <TabsTrigger value="retailer">Retailer Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PaymentsList filter="all" />
        </TabsContent>

        <TabsContent value="farmer">
          <PaymentsList filter="FARMER" />
        </TabsContent>

        <TabsContent value="retailer">
          <PaymentsList filter="RETAILER" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
