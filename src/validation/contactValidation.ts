import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "First name can only contain letters and spaces"),
  
  lastName: z.string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces"),
  
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number"),
  
  companyName: z.string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  
  message: z.string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
});

export type ContactFormData = z.infer<typeof contactFormSchema>;