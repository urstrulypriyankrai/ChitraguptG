import _CreateNewProduct from "../_CreateNewProduct";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  if (slug === "create") return <_CreateNewProduct />;
  return <>dynamic page with slug {slug}</>;
}
