import { z } from "zod";

export const updateCartQuantitySchema = z.object({
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});