export const LogoName = {
  name: "Chitragupt-G",
  tagLine: "Your Reliable Billing and Stock Manager.",
};

// --------------------- NAVBAR DATA ------------------
export interface NavBarLink_type {
  _id: number;
  name: string;
  href: string;
}
export const NAVBAR_LINKS_LIST = [
  {
    _id: 1,
    name: "Home",
    href: "/",
  },

  {
    _id: 3,
    name: "login",
    href: "/login",
  },
];

//======= DASHBOARD TILES LIST ==================
export const TILES_DATA = [
  {
    _id: 1,
    name: "Sell to Farmer",
    href: "/bill-to-farmer",
    icon: "👩‍🌾", // Farmer emoji
  },
  {
    _id: 2,
    name: "Sell to Retailer",
    href: "/bill-to-retailer",
    icon: "🏪", // Retail store emoji
  },
  {
    _id: 3,
    name: "Inventory Management",
    href: "/inventory",
    icon: "📦", // Box emoji for inventory
  },
  {
    _id: 4,
    name: "Returns",
    href: "/returns",
    icon: "🔄", // Circular arrow emoji for returns
  },
  {
    _id: 5,
    name: "Ledger",
    href: "/ledger",
    icon: "📒", // Ledger/book emoji
  },
  {
    _id: 6,
    name: "Farmer Credit Ledger",
    href: "/farmer/credit",
    icon: "📜",
  },
  {
    _id: 7, // Updated to avoid duplicate ID
    name: "Retailer Credit Ledger",
    href: "/retailer/credit",
    icon: "📜",
  },
  {
    _id: 9,
    name: "Create a Farmer",
    href: "/farmer/create",
    icon: "➕", // Scroll emoji for credit tracking
  },
  {
    _id: 10,
    name: "Admin",
    href: "/admin",
    icon: "👨‍💼", // Scroll emoji for credit tracking
  },
];

// --------------------------- SEO ------------------------
export interface SEOData {
  title: string;
  description: string;
}

export const SEO: Record<string, SEOData> = {
  home: {
    title: "ChitraguptG - Smart Billing and Stock Management SystemaguptG ",
    description:
      "ChitraguptG is a modern billing and stock management system tailored for retail and wholesale businesses. It simplifies tracking inventory, generating invoices, managing customer data, and analyzing sales, all in one intuitive interface.",
  },
  about: {
    title: "About Us",
    description: "Learn more about our mission and team.",
  },
};

//=================== EO SEO CONSTANTS ==========================
