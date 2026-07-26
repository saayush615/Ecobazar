import { z } from "zod";

export const sellerProductSchema = z.object({
  name: z.string().min(2, "Name is required"),
  originalPrice: z.coerce.number().positive("Original price must be greater than 0"),
  discountPrice: z.coerce.number().nonnegative("Discount price cannot be negative").optional(),
  category: z.string().optional(),
  stock: z.coerce.number().int().nonnegative("Stock must be a whole number"),
}).superRefine((data, ctx) => {
  if (data.discountPrice !== undefined && data.discountPrice > data.originalPrice) {
    ctx.addIssue({
      code: "custom",
      path: ["discountPrice"],
      message: "Discount price cannot be greater than original price",
    });
  }
});