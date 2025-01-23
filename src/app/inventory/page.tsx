import React from "react";
import { INVENTORY_TILES } from "./_constant";
import Tile from "../_components/Tile";

const page = () => {
  return (
    <div>
      <h1 className="text-center text-2xl">Inventory Management</h1>
      <div className="w-full grid grid-cols-12  gap-3 md:gap-2 h-[60vh]  md:mt-10  ">
        {INVENTORY_TILES.map((data) => {
          return (
            <Tile
              href={data.href}
              key={data._id}
              icon={data.icon}
              title={data.name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default page;
