import React from "react";
import PageHeading from "../_components/PageHeading";
import Tile from "../_components/Tile";
// import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
const ADMIN_TILE = [
  {
    _id: 1,
    name: "Manage Product Category",
    href: "/admin/product/manageCategory",
    icon: "👩‍🌾", // Farmer emoji
  },
  {
    _id: 2,
    name: "Manage Product Units",
    href: "/admin/product/manageUnits",
    icon: "🏪", // Retail store emoji
  },
];

const Page = async () => {
  const session = await auth();
  console.log(session);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return <div>You are not authorized! Contact Admin.</div>;
  }

  return (
    <div>
      <PageHeading heading="Restricted only for admin access" />
      <div className="w-full grid grid-cols-12  gap-3 md:gap-2 h-[60vh]  md:mt-10  ">
        {ADMIN_TILE.map((tile) => {
          return (
            <Tile
              key={tile._id}
              title={tile.name}
              href={tile.href}
              icon={tile.icon}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Page;
