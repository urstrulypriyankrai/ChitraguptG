import PageHeading, { PageSubHeading } from "@/app/_components/PageHeading";
import CreateNewProductUnit from "./CreateNewProductUnit";
import { Suspense } from "react";
import AllUnits from "./AllUnits";
import Loading from "./loading";

export default function Page() {
  return (
    <div className="w-full m-2">
      <PageHeading heading="Manage Product Units" />
      <div className="md:w-[60vw] w-[90vw] mx-auto space-y-2 mt-2">
        <PageSubHeading heading="Create new Unit" />
        <CreateNewProductUnit />
        <Suspense fallback={<Loading />}>
          <AllUnits />
        </Suspense>
      </div>
    </div>
  );
}
