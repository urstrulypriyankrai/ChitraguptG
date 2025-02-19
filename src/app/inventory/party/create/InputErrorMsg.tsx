import React from "react";
import { ZodIssue } from "zod";

type Props = {
  message: ZodIssue[];
};

const InputErrorMsg = (props: Props) => {
  return (
    <>
      {props?.message.map((err) => {
        return (
          <span key={err.code} className="text-sm italic text-red-600">
            {err?.message}
          </span>
        );
      })}
    </>
  );
};

export default InputErrorMsg;
