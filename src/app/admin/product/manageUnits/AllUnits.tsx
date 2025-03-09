"use server";
import { PageSubHeading } from "@/app/_components/PageHeading";
import React, { Suspense } from "react";
import UnitItem from "./UnitItem";
import Loading from "./loading";
import getAllProductUnits from "@/actions/GET/getAllProductUnits";
// import prisma from "@/lib/prisma";

export default async function AllUnits() {
  const units = await getAllProductUnits();
  console.log(units, "from here");
  if (units)
    return (
      <>
        <PageSubHeading heading="List Of All Units" />
        <Suspense fallback={<Loading />}>
          <UnitItem units={units} />
        </Suspense>
      </>
    );
  return <></>;
}
