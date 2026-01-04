/* eslint-disable no-useless-escape */
import { z } from "zod";

export const supplyerFormSchema = z.object({
  company: z.string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number"),
  
  industry: z.string()
    .min(1, "Industry type is required"),
  
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
  confirm: z.string()
    .min(1, "Please confirm your password"),
  
  terms: z.boolean()
    .refine((val) => val === true, "You must accept the terms and conditions")
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export type SupplyerFormData = z.infer<typeof supplyerFormSchema>;

