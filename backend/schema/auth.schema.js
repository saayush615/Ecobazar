import { z } from "zod";

// zod: validate incoming request data at the API layer
// Mongoose: keep as a database safety net for data integrity.

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["buyer", "seller"]),
  phone: z.string().optional(),
  address: z.string().optional(),
  shopName: z.string().optional(),
  businessRegNo: z.string().optional(),
  businessAddress: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === "buyer" && !data.phone) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "Phone is required for buyer" });
  }

  if (data.role === "seller") {
    if (!data.shopName) ctx.addIssue({ code: "custom", path: ["shopName"], message: "Shop name is required for seller" });
    if (!data.businessRegNo) ctx.addIssue({ code: "custom", path: ["businessRegNo"], message: "Business registration number is required for seller" });
    if (!data.businessAddress) ctx.addIssue({ code: "custom", path: ["businessAddress"], message: "Business address is required for seller" });
  }
});

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});