import React from "react";

type Props = {
  heading: string;
};

const PageHeading = ({ heading, ...props }: Props) => {
  return (
    <>
      <h1
        className="text-center text-2xl md:text-3xl font-bold w-full p-2"
        {...props}
      >
        {heading}
      </h1>
    </>
  );
};

export default PageHeading;
