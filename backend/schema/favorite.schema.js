import { z } from "zod";

export const favoriteSchema = z.object({
    productId: z.string().min(1, "Product is required"),
})