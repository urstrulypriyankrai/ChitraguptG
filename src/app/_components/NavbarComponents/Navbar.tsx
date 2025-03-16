"use client";
import React, { useEffect, useState } from "react";
import NavbarForDesktop from "./NavbarForDesktop";
import NavbarForMobile from "./NavbarForMobile";
import { Session } from "next-auth";

const Navbar = ({ session }: { session: Session }) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  useEffect(() => {
    // set initial widht
    const handleScreenSize = () => setScreenWidth(window.innerWidth);
    handleScreenSize();
    window.addEventListener("resize", handleScreenSize);
    return () => window.removeEventListener("resize", handleScreenSize);
  }, []);
  if (screenWidth >= 448) return <NavbarForDesktop session={session} />;
  return <NavbarForMobile />;
};
export default Navbar;
