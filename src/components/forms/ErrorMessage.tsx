import React from "react";

type Props = {
  message: string[];
};

const InputErrorMsg = (props: Props) => {
  return (
    <>
      {props?.message.map((err, index) => {
        return (
          <span key={err[0] + index} className="text-sm italic text-red-600">
            {err}
          </span>
        );
      })}
    </>
  );
};

export default InputErrorMsg;
