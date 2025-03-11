import PageHeading from "@/app/_components/PageHeading";
import CreateNewProduct from "./CreateNewProduct";
import getAllCategories from "@/actions/GET/getAllCategories";
import getAllProductUnits from "@/actions/GET/getAllProductUnits";
import getAllSuppliers from "@/actions/GET/getAllSuppliers";
export default async function Page() {
  const categories = await getAllCategories();
  const units = await getAllProductUnits();
  const suppliers = await getAllSuppliers();
  const modSupplier =
    suppliers?.map((supplier) => ({
      label: supplier.name,
      value: supplier.name,
      id: "" + supplier.id,
    })) || [];

  return (
    <>
      <PageHeading heading="Create A New Product " />
      <CreateNewProduct
        categories={categories}
        units={units}
        suppliers={modSupplier}
      />
    </>
  );
  return null;
}
