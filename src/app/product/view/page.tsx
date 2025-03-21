import PageHeading from "@/app/_components/PageHeading";
import { ProductTable, ProductsWithRelations } from "./table";
import getALlProducts from "@/actions/GET/getAllProducts";

export default async function Page() {
  const products = (await getALlProducts({
    include: {
      variants: true,
      ProductSupplier: true,
    },
  })) as ProductsWithRelations[] | null;

  return (
    <div>
      <PageHeading heading="List Of Products" />
      <div className="m-6">{products && <ProductTable DATA={products} />}</div>
    </div>
  );
}
