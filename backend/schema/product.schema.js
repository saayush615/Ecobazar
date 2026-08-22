import z from "zod";

export const productSchema = z.object({
    
})

export const searchProductQuerySchema = z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    inStock: z.enum(['true', 'false']).optional(),
    sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(50).optional(),
});

export const suggestProductQuerySchema = z.object({
    q: z.string().trim().min(1).max(100),
    limit: z.coerce.number().int().positive().max(10).optional(),
});
