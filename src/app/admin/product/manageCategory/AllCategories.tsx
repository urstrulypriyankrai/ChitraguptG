import { PageSubHeading } from "@/app/_components/PageHeading";
import React, { Suspense } from "react";
import CategoryItem from "./CategoryItem";
import Loading from "./loading";

export default async function AllCategories() {
  const res = await fetch("http://localhost:3000/api/product/category", {
    method: "GET",
    next: {
      tags: ["productCategory"],
      revalidate: 10000,
    },
  });
  const { categories } = await res.json();
  console.log(categories);
  return (
    <>
      <PageSubHeading heading="List Of All Categories" />
      <Suspense fallback={<Loading />}>
        <CategoryItem categories={categories} />
      </Suspense>
    </>
  );
}
