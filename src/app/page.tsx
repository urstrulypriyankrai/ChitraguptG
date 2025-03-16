import DashboardTiles from "./_components/DashboardTiles";

export default async function Home() {
  // const session = await auth();

  // if (!session) {
  //   redirect("/login"); // Redirect to your login page if not authenticated
  // }
  return (
    <div className="w-screen h-screen ">
      <main>
        <DashboardTiles />
      </main>
    </div>
  );
}
