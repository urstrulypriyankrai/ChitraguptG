"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type GenericComboboxProps = {
  data: {
    value: string;
    label: string;
    id: string;
  }[];
  value: { value: string; id: string } | null;
  setValue: React.Dispatch<
    React.SetStateAction<{ value: string; id: string } | null>
  >;
  placeholder?: string;
  className?: string;
};

export function GenericCombobox({
  data,
  value,
  setValue,
  placeholder = "Select an option...",
  className,
}: GenericComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Calculate selected label with fallback to value
  const selectedLabel = React.useMemo(() => {
    if (!value) return "";
    const foundItem = data.find((item) => item.value === value.value);
    return foundItem ? foundItem.label : value.value;
  }, [data, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value ? selectedLabel : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id} // Changed from item.label to item.id for unique keys
                  value={item.label}
                  onSelect={() => {
                    setValue({ value: item.value, id: item.id });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
