// src/app/address/[slug]/page.tsx
import PageHeading from "@/app/_components/PageHeading";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Page({ params }: { params: { slug: string } }) {
  const address = await prisma.address.findUnique({
    where: { id: parseInt(params.slug) },
  });

  if (!address) {
    return <div>Address not found</div>;
  }

  return (
    <>
      <PageHeading heading="Edit Address" />
      <form action="">
        
      </form>
    </>
  );
}
