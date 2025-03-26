import { Suspense } from "react";
import { PartyLedger } from "./partyLedger";
import PageHeading from "@/app/_components/PageHeading";
import prisma from "@/lib/prisma";
export default async function LedgerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const party = await prisma.party.findUnique({ where: { id } });
  return (
    <div className="container mx-auto py-6 md:px-10 px-2">
      <PageHeading heading={"Party Ledger For " + party?.name} />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        <PartyLedger id={id} filter="DEBIT" />
      </Suspense>
    </div>
  );
}
