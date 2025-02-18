import { Toaster } from "@/components/ui/toaster";
import DashboardTiles from "./_components/DashboardTiles";

export default function Home() {
  return (
    <div className="w-screen h-screen ">
      <main>
        <DashboardTiles />
      </main>
      <Toaster />
    </div>
  );
}
