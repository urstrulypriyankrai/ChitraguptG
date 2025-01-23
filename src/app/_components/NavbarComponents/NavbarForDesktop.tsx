import React from "react";
import { LogoName } from "@/_constants/appConfigConstants";
import {
  NAVBAR_LINKS_LIST,
  NavBarLink_type,
} from "@/_constants/appConfigConstants";
import Link from "next/link";
import ToggleDarkMode from "./ToggleDarkMode";

//---------------- EO VARS ---------------------------

const NavbarForDesktop = () => {
  return (
    <nav className=" flex mx-6 broder border-b">
      <LeftHeading title={LogoName.name} tagline={LogoName.tagLine} />
      <MainMenu />
      <ToggleDarkMode />
    </nav>
  );
};

export default NavbarForDesktop;

// LEFT SIDE LOGO
const LeftHeading = ({
  title,
  tagline,
}: {
  title: string;
  tagline: string;
}) => {
  return (
    <div className="block mx-2 w-64  py-2">
      <p className="md:text-3xl text-2xl font-bold ">{title}</p>
      <p className="text-sm italic text-muted-foreground ">{tagline}</p>
    </div>
  );
};

// NAV MENU
const MainMenu = () => {
  return (
    <div className="flex flex-1 m-3 p-2 justify-center items-center space-x-6">
      {NAVBAR_LINKS_LIST.map((item: NavBarLink_type) => {
        return (
          <Link
            href={item.href}
            key={item._id}
            className="border border-input px-2 py-1 rounded-md hover:bg-accent"
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};
