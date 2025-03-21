import PageHeading from "@/app/_components/PageHeading";
import { ProductTable } from "./table";
import { Product } from "@prisma/client";
import getALlProducts from "@/actions/GET/getAllProducts";

export default async function Page() {
  const products: Product[] | null = await getALlProducts({
    include: {
      variants: true,
      ProductSupplier: true,
    },
  });

  return (
    <div>
      <PageHeading heading="List Of Products" />
      <div className="m-6">{products && <ProductTable DATA={products} />}</div>
    </div>
  );
}
