import _CreateNewProduct from "../_CreateNewProduct";
type Props = {
  params: { slug: string };
};

export default async function Page(props: Props) {
  const { slug } = await props.params;
  if (slug === "create") return <_CreateNewProduct />;
  return <>dynamic page with slug {props.params.slug}</>;
}
