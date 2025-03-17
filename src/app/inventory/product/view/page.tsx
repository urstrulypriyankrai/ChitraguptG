import getALlProducts from "@/actions/GET/getAllProducts";
import PageHeading from "@/app/_components/PageHeading";
import ProductTable, { DataTable } from "./data-table";
import getAllCategories from "@/actions/GET/getAllCategories";
import getAllProductUnits from "@/actions/GET/getAllProductUnits";
import { columns } from "./columns";

export default async function Page() {
  const products = await getALlProducts();
  // const categories = await getAllCategories();
  // const units = await getAllProductUnits();
  // const tax = await prisma.tax.findMany();

  // console.log(data);
  return (
    <section>
      <PageHeading heading="Product Inventory" />
      <DataTable columns={columns} data={products} />
    </section>
  );
}
