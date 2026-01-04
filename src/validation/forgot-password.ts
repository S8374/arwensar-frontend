import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;