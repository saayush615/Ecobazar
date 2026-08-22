import z from "zod";

export const reviewSchema = z.object({
    rating: z.coerce.number().int("Rating must be a whole number")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),
    comment: z.string().max(500, "Comment cannot exceed 500 characters").optional(),
})