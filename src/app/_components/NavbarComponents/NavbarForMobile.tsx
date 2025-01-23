import React from "react";
import { LogoName } from "@/_constants/appConfigConstants";
// import {
//   NAVBAR_LINKS_LIST,
//   NavBarLink_type,
// } from "@/_constants/appConfigConstants";
// import Link from "next/link";
import ToggleMenuBtn from "./ToggleMenuBtn";


// ========================= NAVBAR FOR MOBILE DEVICES ============
const NavbarForMobile = () => {
  return (
    <nav className="w-screen  grid grid-cols-10 grid-flow-col place-items-center ">
      <CenterHeading title={LogoName.name} tagline={LogoName.tagLine} />
      <div className="col-span-2 flex justify-end w-[96%] ">
        <ToggleMenuBtn />
      </div>
    </nav>
  );
};
export default NavbarForMobile;

// LEFT SIDE LOGO
const CenterHeading = ({
  title,
  tagline,
}: {
  title: string;
  tagline: string;
}) => {
  return (
    <div className="block ml-2 w-64  py-2 text-center col-span-7">
      <p className="sm:text-xl text-2xl font-bold ">{title}</p>
      <p className="text-sm italic text-muted-foreground ">{tagline}</p>
    </div>
  );
};
