import { z } from "zod";

const TileSchema = z.object({
  id: z.number(),
  name: z.string(),
  href: z.string(),
  icon: z.string(),
  description: z.string().optional(),
});

const CategoryEnum = z.enum([
  "Sales Operations",
  "Inventory Management",
  "Returns & Payments",
  "Financial Records",
  "User Management",
]);

// Category schema
const CategorySchema = z.object({
  name: CategoryEnum,
  tiles: z.array(TileSchema),
});

// Full categories schema
const CategoriesSchema = z.record(CategoryEnum, z.array(TileSchema));

// Type exports
type Tile = z.infer<typeof TileSchema>;
type Category = z.infer<typeof CategoryEnum>;
type Categories = z.infer<typeof CategoriesSchema>;

export {
  TileSchema,
  CategoryEnum,
  CategorySchema,
  CategoriesSchema,
  type Tile,
  type Category,
  type Categories,
};
