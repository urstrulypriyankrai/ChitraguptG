export const INVENTORY_TILES = [
  {
    _id: 1,
    name: "Add Product",
    href: "/inventory/product/create",
    icon: "➕", // Plus sign emoji for adding
    description: "Add a new product to the inventory database.",
  },
  {
    _id: 2,
    name: "Create a Party",
    href: "/inventory/party/create",
    icon: "🤝", // Handshake emoji for parties
    description: "Add a new supplier or party for inventory management.",
  },
  {
    _id: 3,
    name: "View All Products",
    href: "/inventory/product",
    icon: "📋", // Clipboard emoji for viewing items
    description: "View all products currently in inventory.",
  },
  {
    _id: 4,
    name: "View All Parties",
    href: "/inventory-management/view-parties",
    icon: "👥", // People emoji for parties
    description:
      "View a list of all suppliers and parties linked to the inventory.",
  },
  {
    _id: 5,
    name: "Update Stock",
    href: "/inventory-management/add-stock",
    icon: "📦", // Box emoji for adding stock
    description:
      "Add stock,remove stocks to existing products in the inventory.",
  },

  {
    _id: 7,
    name: "Product Returns",
    href: "/inventory-management/product-returns",
    icon: "🔄", // Circular arrow emoji for returns
    description:
      "Manage product returns from farmers, retailers, or other parties.",
  },
  {
    _id: 8,
    name: "Generate Stock Report",
    href: "/inventory-management/stock-report",
    icon: "📊", // Bar chart emoji for reporting
    description: "Generate detailed reports on stock and inventory levels.",
  },
  {
    _id: 9,
    name: "Low Stock Alerts",
    href: "/inventory-management/low-stock",
    icon: "⚠️", // Warning emoji for low stock
    description:
      "View items that are running low on stock to restock proactively.",
  },
  {
    _id: 10,
    name: "Supplier Payments",
    href: "/inventory-management/supplier-payments",
    icon: "💰", // Money bag emoji for payments
    description: "Manage payments and dues for suppliers and parties.",
  },
];
