"use client";
import InputErrorMsg from "@/app/inventory/party/create/InputErrorMsg";
import * as React from "react";
import { ZodIssue } from "zod";
// type Message = { code: string; message: string }; // Singular object, not an array

interface LabeledInputProps extends React.ComponentProps<"input"> {
  id?: string;
  name: string;
  label: string;
  error?: boolean;
  danger?: boolean;
  placeholder?: string;
  message?: ZodIssue[];
  hidden?: boolean;
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  (
    { label, id, name, message, type = "text", hidden = false, ...props },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div hidden={hidden}>
        <div className="relative">
          <input
            type={type}
            id={inputId}
            ref={ref}
            name={name}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer border"
            {...props}
          />
          <label
            htmlFor={inputId}
            className="absolute text-lg    text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4  scale-75 top-2 z-10 origin-[0] bg-background  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto "
          >
            {label}
          </label>
        </div>

        {message && <InputErrorMsg message={message} />}
      </div>
    );
  }
);

LabeledInput.displayName = "LabeledInput";

export { LabeledInput };
