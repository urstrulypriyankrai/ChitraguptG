import { z } from "zod";

export const CATEGORY = ["FERTILIZER", "PESTICIDE", "INSECTICIDE", "EQUIPMENT"];
export const WEIGHT_UNIT = ["KG", "LITER", "PIECE", "BAG"];

export const ProductSchema = z.object({
  name: z.string(),
});
