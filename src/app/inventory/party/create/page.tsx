import PageHeading from "@/app/_components/PageHeading";
import React from "react";
import CreatePartyForm from "./CreatePartyForm";

const CreateParty = () => {
  return (
    <>
      <PageHeading heading="Create a Party" />
      <div className="mt-10">
        <CreatePartyForm />
        </div>
    </>
  );
};

export default CreateParty;
