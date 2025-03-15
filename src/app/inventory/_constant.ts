export const TILES_DATA = [
  { id: 1, name: "Sell to Farmer", href: "/bill-to-farmer", icon: "🌾" },
  { id: 2, name: "Sell to Retailer", href: "/bill-to-retailer", icon: "🏪" },

  { id: 3, name: "Inventory Management", href: "/inventory", icon: "📦" },
  {
    id: 10,
    name: "Add Product",
    href: "/inventory/product/create",
    icon: "➕",
    description: "Add a new product to the inventory database.",
  },
  {
    id: 11,
    name: "Create a Party",
    href: "/inventory/party/create",
    icon: "🤝",
    description: "Add a new supplier or party for inventory management.",
  },
  {
    id: 12,
    name: "View All Products",
    href: "/inventory/product",
    icon: "📋",
    description: "View all products currently in inventory.",
  },
  {
    id: 13,
    name: "View All Parties",
    href: "/inventory-management/view-parties",
    icon: "👥",
    description:
      "View a list of all suppliers and parties linked to the inventory.",
  },
  {
    id: 14,
    name: "Update Stock",
    href: "/inventory-management/add-stock",
    icon: "📦",
    description: "Add or remove stocks for existing products in the inventory.",
  },
  {
    id: 17,
    name: "Low Stock Alerts",
    href: "/inventory-management/low-stock",
    icon: "⚠️",
    description:
      "View items that are running low on stock to restock proactively.",
  },

  { id: 4, name: "Returns", href: "/returns", icon: "🔄" },
  {
    id: 15,
    name: "Product Returns",
    href: "/inventory-management/product-returns",
    icon: "🔄",
    description:
      "Manage product returns from farmers, retailers, or other parties.",
  },
  {
    id: 18,
    name: "Supplier Payments",
    href: "/inventory-management/supplier-payments",
    icon: "💰",
    description: "Manage payments and dues for suppliers and parties.",
  },

  { id: 5, name: "Ledger", href: "/ledger", icon: "📒" },
  { id: 6, name: "Farmer Credit Ledger", href: "/farmer/credit", icon: "📜" },
  {
    id: 7,
    name: "Retailer Credit Ledger",
    href: "/retailer/credit",
    icon: "📜",
  },
  {
    id: 16,
    name: "Generate Stock Report",
    href: "/inventory-management/stock-report",
    icon: "📊",
    description: "Generate detailed reports on stock and inventory levels.",
  },

  { id: 8, name: "Create a Farmer", href: "/farmer/create", icon: "➕" },
  { id: 9, name: "Admin", href: "/admin", icon: "👨‍💼" },
];
