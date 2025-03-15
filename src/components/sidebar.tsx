"use state";
import { useState } from "react";
import { Button } from "./ui/button";

type CategoryType = { name: string; icon: string };
export default function SideBar({
  categories,
  activeCategory,
  setActiveCategory,
}: {
  categories: CategoryType[];
  activeCategory: string | null;
  setActiveCategory: React.Dispatch<string | null>;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  return (
    <>
      <div className="lg:hidden p-4 border-b border-border">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden"
        >
          ☰
        </Button>
      </div>

      {/* Collapsible Sidebar Navigation */}
      <aside
        className={`fixed lg:relative z-50 h-screen lg:h-auto ${
          isSidebarCollapsed ? "lg:w-16" : "lg:w-64"
        } p-4 bg-card border-r border-border transform transition-[width] duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-bold text-foreground ${
              isSidebarCollapsed ? "lg:hidden" : ""
            }`}
          >
            Navigation
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsSidebarCollapsed(!isSidebarCollapsed);
              setIsMobileMenuOpen(false);
            }}
            className=" lg:block"
          >
            {isMobileMenuOpen ? (
              <span>X</span>
            ) : isSidebarCollapsed ? (
              "➡️"
            ) : (
              "⬅️"
            )}
          </Button>
        </div>

        <nav className="space-y-1">
          <Button
            variant={!activeCategory ? "secondary" : "ghost"}
            onClick={() => {
              setActiveCategory(null);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full justify-start gap-3 ${
              isSidebarCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <span>🏠</span>
            <span className={`${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              All Categories
            </span>
          </Button>

          {categories.map((category: CategoryType) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "secondary" : "ghost"}
              onClick={() => {
                setActiveCategory(category.name);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full justify-start gap-3 ${
                isSidebarCollapsed ? "lg:justify-center" : ""
              }`}
            >
              <span>{category.icon}</span>
              <span className={`${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                {category.name}
              </span>
            </Button>
          ))}
        </nav>
      </aside>
    </>
  );
}
