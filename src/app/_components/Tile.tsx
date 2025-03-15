import Link from "next/link";

const Tile = ({
  title,
  href,
  icon,
  description,
}: {
  title: string;
  href: string;
  icon: string;
  description?: string;
}) => {
  return (
    <Link
      href={href}
      className="group block p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
export default Tile;

export const TileWrapper = ({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      {...props}
    >
      {children}
    </div>
  );
};
