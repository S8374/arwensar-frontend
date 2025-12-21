import { z } from "zod";

export const alertSchema = z.object({
  title: z.string()
    .min(1, "Alert title is required")
    .min(5, "Alert title must be at least 5 characters")
    .max(100, "Alert title must be less than 100 characters"),
  
  priority: z.enum(["HIGH", "MEDIUM", "LOW"] as const, {
    message: "Severity level is required",
  }),
  
  description: z.string()
    .min(1, "Alert description is required")
    .min(10, "Alert description must be at least 10 characters")
    .max(1000, "Alert description must be less than 1000 characters"),
});

export type AlertData = z.infer<typeof alertSchema>;