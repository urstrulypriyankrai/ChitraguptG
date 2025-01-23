import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

type Props = {
  key?: string;
  data: string[];
  name: string;
  disabled?: boolean;
  setValue?: (
    value: string
  ) => void | Dispatch<SetStateAction<string | null> | string[] | null>; // Updated type
  placeholder: string; // Added placeholder prop
};

const CustomSelectBox = ({
  data,
  name,
  disabled,
  setValue,
  placeholder,
}: Props) => {
  // Destructured props
  return (
    <Select
      onValueChange={(val) => {
        if (setValue) setValue(val);
      }}
      disabled={disabled} // Added disabled prop
    >
      <SelectTrigger
        name={name}
        className={cn(
          "w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer border py-6"
        )}
      >
        <SelectValue placeholder={placeholder} /> {/* Use placeholder prop */}
      </SelectTrigger>
      <SelectContent>
        {" "}
        {/* Removed defaultValue */}
        {data?.map(
          (
            item // Use item instead of state for clarity
          ) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
};

export default CustomSelectBox;
