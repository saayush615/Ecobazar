import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required"),
});