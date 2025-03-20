import { auth } from "@/auth";
import UpdatePage from "./(update)/UpdatePage";

export default async function Page({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  const { slug } = await params;
  const session = await auth();

  if (session?.user.role !== "ADMIN")
    return <div>You are not authorized to edit the address</div>;
  if (slug.length < 2) return <div>Invalid URL!</div>;

  if (slug[0] === "UPDATE") {
    return <UpdatePage />;
  }

  return (
    <div>
      <div>
        <h1>{session.user.name} </h1>
      </div>
    </div>
  );
}
