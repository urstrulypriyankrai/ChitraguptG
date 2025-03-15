import getALlProducts from "@/actions/GET/getAllProducts";

export default async function Page() {
  const data = await getALlProducts();
  console.log(data);
  return <></>;
}
