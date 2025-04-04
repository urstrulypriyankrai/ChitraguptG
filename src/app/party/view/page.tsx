import PageHeading from "@/app/_components/PageHeading";
import PartyTable from "./table";
import getAllParty from "@/actions/GET/getAllParty";
import { Address, Party } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PartyWithRelations = Party & {
  address: Address | null;
};
export default async function Page() {
  await fetch(process.env.BASE_URL + "/api/revalidate?tag=getAllParty");
  const parties = (await getAllParty({
    include: {
      address: true,
    },
  })) as PartyWithRelations[] | null;
  console.log(parties);
  if (!parties) return;
  return (
    <>
      <PageHeading heading="CUSTOMERS / SUPPLIERS" />
      <div className="container mx-auto py-6  px-2">
        <Tabs defaultValue="all" className="w-full px-2">
          <TabsList className="mb-4 space-x-6">
            <TabsTrigger value="all">All Parties</TabsTrigger>
            <TabsTrigger value="farmers">FARMER / RETAILERS</TabsTrigger>
            <TabsTrigger value="suppliers">SUPPLIERS</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <PartyTable DATA={parties} />
          </TabsContent>

          <TabsContent value="farmers">
            <PartyTable
              DATA={parties.filter((party) => party.partyType != "SUPPLIER")}
            />
          </TabsContent>

          <TabsContent value="suppliers">
            <PartyTable
              DATA={parties.filter((party) => party.partyType == "SUPPLIER")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
