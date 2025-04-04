import Tile, { TileWrapper } from "@/app/_components/Tile";

const TILES_DATA = [
  {
    id: 1,
    name: "Customers",
    href: "/",
    icon: "🌾",
  },
  { id: 2, name: "Sell to Retailer", href: "/bill-to-retailer", icon: "🏪" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {" "}
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main
          className={`flex-1 p-4 lg:p-8 transition-margin duration-300 w ${"lg:ml-6"}`}
        >
          <TileWrapper>
            {TILES_DATA?.map((tile) => (
              <Tile
                key={tile.id}
                href={tile.href}
                title={tile.name}
                icon={tile.icon}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                description={tile.description ? tile.description : ""}
              />
            ))}
          </TileWrapper>
        </main>
      </div>
    </div>
  );
}
