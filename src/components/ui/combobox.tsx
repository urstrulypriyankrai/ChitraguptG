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

type ComboboxItem = {
  value: string;
  label: string;
  id: string;
};

type GenericComboboxProps = {
  data: ComboboxItem[];
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
  const selectedLabel = React.useMemo(() => {
    return value
      ? data.find((item) => item.value === value.value)?.label || ""
      : "";
  }, [data, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between p-6 rounded-lg active:border-blue-500",
            className
          )}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[40vw] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.label}
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
