"use state";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import React from "react";

const ToggleDarkMode = () => {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <Button
        onClick={() => setTheme(theme == "dark" ? "Light" : "dark")}
        className="border border-input  m-5 px-2 rounded-full "
      >
        {theme == "dark" ? "Light" : "dark"}
      </Button>
    </>
  );
};

export default ToggleDarkMode;
