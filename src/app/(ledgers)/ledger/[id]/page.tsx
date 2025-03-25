import { Suspense } from "react";
import { PartyLedger } from "./partyLedger";

export default function LedgerPage({ params }: { params: { id: string } }) {
  // const { id } = await params;
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Party Ledger</h1>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <PartyLedger id={params.id} filter="all" />
      </Suspense>
    </div>
  );
}
