import { z } from "zod";

export const CATEGORY = ["FERTILIZER", "PESTICIDE", "INSECTICIDE", "EQUIPMENT"];
export const WEIGHT_UNIT = ["KG", "LITER", "PIECE", "BAG"];

export const ProductSchema = z.object({
  name: z.string(),
});

export const GST_RATE_MAP = {
  ZERO: 0,
  FIVE: 5,
  EIGHTEEN: 18,
  TWENTY_EIGHT: 28,
};
