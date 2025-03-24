import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeading from "@/app/_components/PageHeading";
import UniversalLedger from "./universal-ledger";

export const metadata: Metadata = {
  title: "Universal Ledger | ChitraguptG",
  description: "View and manage all financial transactions in one place",
};

export default function LedgerPage() {
  return (
    <div className="container mx-auto py-6 md:px-10 px-2">
      <PageHeading heading="Universal Ledger" />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="credit">Credits (Incoming)</TabsTrigger>
          <TabsTrigger value="debit">Debits (Outgoing)</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UniversalLedger filter="all" />
        </TabsContent>

        <TabsContent value="credit">
          <UniversalLedger filter="CREDIT" />
        </TabsContent>

        <TabsContent value="debit">
          <UniversalLedger filter="DEBIT" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
