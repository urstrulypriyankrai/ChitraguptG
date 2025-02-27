import React from "react";

type Props = React.HTMLAttributes<HTMLHeadingElement> & {
  heading: string;
};

const PageHeading = ({ heading, ...props }: Props) => {
  return (
    <h1
      className="text-center text-2xl md:text-3xl font-bold w-full p-2"
      {...props}
    >
      {heading}
    </h1>
  );
};

const PageSubHeading = ({ heading, ...props }: Props) => {
  return (
    <h2 className="text-xl md:text-xl font-semibold w-full p-1" {...props}>
      {heading}
    </h2>
  );
};

export { PageHeading, PageSubHeading };
export default PageHeading;
