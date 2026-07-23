import { z } from "zod";

export const favoriteSchema = z.object({
    product: z.string().min(1, "Product is required"),
})