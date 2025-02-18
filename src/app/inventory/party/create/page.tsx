import PageHeading from "@/app/_components/PageHeading";
import React from "react";
import CreatePartyForm from "./CreatePartyForm";

const CreateParty = () => {
  return (
    <>
      <PageHeading heading="Create a Party" />
      <CreatePartyForm />
    </>
  );
};

export default CreateParty;
