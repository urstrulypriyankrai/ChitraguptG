import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const Tile = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: string;
}) => {
  return (
    <Link href={href} className="col-span-9 md:col-span-5 lg:col-span-3">
      <Card className="w-[300px] rounded-md bg-card m-2 p-2 md:p-6 hover:bg-accent mx-auto flex flex-col h-[200px] ">
        <CardHeader>
          <CardDescription className="text-center text-3xl ">
            {icon}
          </CardDescription>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </Link>
  );
};
export default Tile;
