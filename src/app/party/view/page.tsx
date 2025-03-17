import PageHeading from "@/app/_components/PageHeading";
import PartyTable from "./table";
import getAllParty from "@/actions/GET/getAllParty";

export default async function Page() {
  const parties = await getAllParty({
    include: {
      address: true,
    },
  });
  return (
    <div>
      <PageHeading heading="View All Party" />
      <div className="m-6">{parties && <PartyTable DATA={parties} />}</div>
    </div>
  );
}
