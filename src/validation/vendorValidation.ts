// src/validation/vendorValidation.ts
import { z } from "zod";

export const vendorFormSchema = z.object({
  // Personal email for login
  email: z.string().email("Valid email is required"),
  
  // Password fields
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "Password must contain at least one uppercase, one lowercase, and one number"),
  
  confirmPassword: z.string()
    .min(6, "Confirm password is required"),
  
  // Personal details
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  
  // Company details
  companyName: z.string().min(1, "Company name is required"),
  businessEmail: z.string().email("Valid business email is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  industryType: z.string().min(1, "Industry type is required"),
  
  // Terms acceptance
  termsAccepted: z.boolean()
    .refine(val => val === true, {
      message: "You must accept the terms and conditions"
    }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type VendorFormData = z.infer<typeof vendorFormSchema>;