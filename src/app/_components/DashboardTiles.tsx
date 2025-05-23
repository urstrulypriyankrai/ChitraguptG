"use client";
import { useState } from "react";

import SideBar from "@/components/sidebar";
import Tile, { TileWrapper } from "./Tile";

const TILES_DATA = {
  "Sales Operations": [
    { id: 1, name: "Sell to Customer", href: "/bill-to-farmer", icon: "🌾" },
    { id: 2, name: "Sell to Retailer", href: "/bill-to-retailer", icon: "🏪" },
  ],

  "Inventory Management": [
    {
      id: 10,

      name: "Add Product",

      href: "/inventory/product/create",

      icon: "➕",

      description: "Add a new product to the inventory database.",
    },

    {
      id: 12,

      name: "Products",

      href: "/product/view",

      icon: "📋",

      description: "View all products currently in inventory.",
    },

    {
      id: 13,

      name: "Customers",

      href: "/party/view",

      icon: "👥",

      description:
        "View a list of all suppliers and parties linked to the inventory.",
    },

    {
      id: 14,

      name: "Update Stock",

      href: "/inventory-management/add-stock",

      icon: "📦",

      description:
        "Add or remove stocks for existing products in the inventory.",
    },

    {
      id: 17,

      name: "Low Stock Alerts",

      href: "/inventory-management/low-stock",

      icon: "⚠️",

      description:
        "View items that are running low on stock to restock proactively.",
    },
  ],
  "Returns & Payments": [
    {
      id: 18,

      name: "Payments",

      href: "/payments",

      icon: "💰",

      description: "Manage payments and dues for suppliers and parties.",
    },

    {
      id: 15,

      name: "Product Return",

      href: "/returns",

      icon: "🔄",

      description:
        "Manage product returns from farmers, retailers, or other parties.",
    },
  ],
  "Financial Records": [
    { id: 5, name: "Ledger", href: "/ledger", icon: "📒" },

    {
      id: 16,

      name: "Generate Stock Report",

      href: "/inventory-management/stock-report",

      icon: "📊",

      description: "Generate detailed reports on stock and inventory levels.",
    },
  ],
  "User Management": [
    {
      id: 8,
      name: "Create New Customer",
      href: "/farmer/create",
      icon: "➕",
      description: "add new customers",
    },
    {
      id: 11,

      name: "Create a Party",

      href: "/inventory/party/create",

      icon: "🤝",

      description: "Add a new supplier or party for inventory management.",
    },

    { id: 9, name: "Admin", href: "/admin", icon: "👨‍💼" },
  ],
};

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoryIcons = {
    "Sales Operations": "🌾",
    "Inventory Management": "📦",
    "Returns & Payments": "🔄",
    "Financial Records": "📒",
    "User Management": "👤",
  };
  const categories = Object.keys(TILES_DATA).map((val: string) => {
    const data = {
      name: val,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      icon: categoryIcons[val],
    };
    return data;
  });

  return (
    <div className="min-h-screen bg-background">
      {" "}
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Menu Button */}
        <SideBar
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Main Content */}
        <main
          className={`flex-1 p-4 lg:p-8 transition-margin duration-300 w ${"lg:ml-6"}`}
        >
          <TileWrapper>
            {Object.entries(TILES_DATA)
              .filter(
                ([category]) => !activeCategory || category === activeCategory
              )
              .flatMap(([, tiles]) => tiles)
              .map((tile) => (
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
