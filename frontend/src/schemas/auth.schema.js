import { z } from "zod";

// login form validation
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  terms: z.literal(true, { errorMap: () => ({ message: "You must accept terms and conditions" }) }),
  role: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  shopName: z.string().optional(),
  businessRegNo: z.string().optional(),
  businessAddress: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }

  if (data.role === "buyer" && !data.phone) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "Phone is required for buyer" });
  }

  if (data.role === "seller") {
    if (!data.shopName) ctx.addIssue({ code: "custom", path: ["shopName"], message: "Shop name is required for seller" });
    if (!data.businessRegNo) ctx.addIssue({ code: "custom", path: ["businessRegNo"], message: "Business registration number is required for seller" });
    if (!data.businessAddress) ctx.addIssue({ code: "custom", path: ["businessAddress"], message: "Business address is required for seller" });
  }
});