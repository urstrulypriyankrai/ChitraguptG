import PageHeading from "@/app/_components/PageHeading";
import PartyTable from "./table";
import getAllParty from "@/actions/GET/getAllParty";
import { Address, Party } from "@prisma/client";

type PartyWithRelations = Party & {
  address: Address | null;
};
export default async function Page() {
  const parties = (await getAllParty({
    include: {
      address: true,
    },
  })) as PartyWithRelations[] | null;
  console.log(parties);
  return (
    <div>
      <PageHeading heading="View All Party" />
      <div className="m-6">{parties && <PartyTable DATA={parties} />}</div>
    </div>
  );
}
