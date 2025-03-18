import PageHeading from "@/app/_components/PageHeading";
import CreateNewProduct from "./CreateNewProduct";
import getAllCategories from "@/actions/GET/getAllCategories";
import getAllProductUnits from "@/actions/GET/getAllProductUnits";
import getAllSuppliers from "@/actions/GET/getAllSuppliers";
import getAllTaxes from "@/actions/GET/getAllTaxes";
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
      <PageHeading
        heading="New Product Creattion "
        // className="border-b border-dashed"
      />
      <CreateNewProduct
        categories={categories}
        units={units}
        suppliers={modSupplier}
      />
    </>
  );
  return null;
}
