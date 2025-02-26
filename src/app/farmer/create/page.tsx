import PageHeading from "@/app/_components/PageHeading";
import CreateNewFarmer from "@/app/farmer/create/CreateNewFarmer";
import React from "react";

const page = () => {
  return (
    <>
      <PageHeading heading="Create A Farmer" />
      <CreateNewFarmer />
    </>
  );
};

export default page;
