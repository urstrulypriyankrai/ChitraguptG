import { PartyLedger } from "./partyLedger";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <PartyLedger id={id} />;
}
