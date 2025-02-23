import { ZodSchema, z } from "zod";

/**
 * Validates data against a Zod schema and returns the safeParse result.
 *
 * @param {z.ZodSchema} schema - The Zod schema to validate against.
 * @param {any} data - The data to validate.
 * @returns {z.SafeParseResult} - The result of the safeParse operation.
 */
export function checkDataValidation(schema: ZodSchema, data: unknown) {
  return schema.safeParse(data);
}
