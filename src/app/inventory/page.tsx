import React from "react";
import { TILES_DATA } from "@/_constants/appConfigConstants";
import Tile, { TileWrapper } from "../_components/Tile";
// import SideBar from "@/components/sidebar";

const page = () => {
  return (
    <div className="m-2">
      <h1 className="text-center text-2xl">Inventory Management</h1>
      <TileWrapper>
        {TILES_DATA.map((data) => {
          return (
            <Tile
              href={data.href}
              key={data._id}
              icon={data.icon}
              title={data.name}
            />
          );
        })}
      </TileWrapper>
    </div>
  );
};

export default page;
