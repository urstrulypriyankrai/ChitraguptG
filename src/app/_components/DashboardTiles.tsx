import * as React from "react";
import { TILES_DATA } from "@/_constants/appConfigConstants";
import Tile from "@/app/_components/Tile";

// ============ EO IMPORTS =============

const DashboardTiles = () => {
  return (
    <div className="w-full grid grid-cols-12  gap-3 md:gap-2 h-[60vh]  md:mt-10  ">
      {TILES_DATA.map((tile) => {
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
  );
};

export default DashboardTiles;
