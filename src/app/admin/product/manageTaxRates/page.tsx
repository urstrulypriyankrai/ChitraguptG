import PageHeading, { PageSubHeading } from "@/app/_components/PageHeading";
import CreateNewCategory from "./CreateNewCategory";
import { Suspense } from "react";
import AllCategories from "./AllCategories";
import Loading from "./loading";

export default function Page() {
  return (
    <div className="w-full m-2">
      <PageHeading heading="Manage Product Categories" />
      <div className="md:w-[60vw] w-[90vw] mx-auto space-y-2 mt-2">
        <PageSubHeading heading="Create new Categories" />
        <CreateNewCategory />
        <Suspense fallback={<Loading />}>
          <AllCategories />
        </Suspense>
      </div>
    </div>
  );
}
