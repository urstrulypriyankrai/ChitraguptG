import React from "react";
import { LogoName } from "@/_constants/appConfigConstants";
import {
  NAVBAR_LINKS_LIST,
  NavBarLink_type,
} from "@/_constants/appConfigConstants";
import Link from "next/link";
import ToggleDarkMode from "./ToggleDarkMode";
import { cn } from "@/lib/utils"; // Assuming you have shadcn/ui utils

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const NavbarForDesktop = ({ session }: { session: Session }) => {
  return (
    <nav className="flex items-center justify-between px-6 h-16 border-b">
      <div className="flex items-center flex-1 max-w-10xl mx-auto">
        <LeftHeading title={LogoName.name} tagline={LogoName.tagLine} />
        <MainMenu />
        <div className="ml-auto flex items-center gap-4">
          <ToggleDarkMode />
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full flex items-center gap-2 hover:bg-accent/50 pr-3"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium hidden sm:inline-block">
                    {session.user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-lg shadow-lg border bg-background/95 backdrop-blur"
              >
                <div className="p-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="w-full flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <div
                      onClick={async () =>
                        await signOut({
                          redirect: true,
                          redirectTo: "/",
                        })
                      }
                      className="w-full flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                    >
                      Logout
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

const LeftHeading = ({
  title,
  tagline,
}: {
  title: string;
  tagline: string;
}) => {
  return (
    <div className="flex-shrink-0 mr-8">
      <Link href="/" className="group inline-flex flex-col">
        <p className="text-2xl font-bold tracking-tight text-foreground group-hover:opacity-80 transition-opacity">
          {title}
        </p>
        <p className="text-sm font-medium text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
          {tagline}
        </p>
      </Link>
    </div>
  );
};

const MainMenu = () => {
  return (
    <div className="hidden md:flex items-center gap-2">
      {NAVBAR_LINKS_LIST.map((item: NavBarLink_type) => (
        <NavLink key={item._id} item={item} />
      ))}
    </div>
  );
};

const NavLink = ({ item }: { item: NavBarLink_type }) => {
  return (
    <Link
      href={item.href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-accent/50 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      {item.name}
    </Link>
  );
};

export default NavbarForDesktop;
