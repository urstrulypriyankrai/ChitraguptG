import { PageSubHeading } from "@/app/_components/PageHeading";
import React, { Suspense } from "react";
import CategoryItem from "./CategoryItem";
import Loading from "./loading";
import getAllCategories from "@/actions/GET/getAllCategories";

export default async function AllCategories() {
  const categories = await getAllCategories();

  return (
    <>
      <PageSubHeading heading="List Of All Categories" />
      <Suspense fallback={<Loading />}>
        <CategoryItem categories={categories || []} />
      </Suspense>
    </>
  );
}
