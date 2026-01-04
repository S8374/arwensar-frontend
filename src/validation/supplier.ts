/* eslint-disable no-useless-escape */
import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string()
    .min(1, "Supplier name is required")
    .min(2, "Supplier name must be at least 2 characters")
    .max(100, "Supplier name must be less than 100 characters"),

  contact: z.string()
    .min(1, "Contact person is required")
    .min(2, "Contact person must be at least 2 characters"),

  criticality: z.enum(["critical", "high", "medium", "low"])
    .refine((val) => val, { message: "Criticality level is required" }),

  category: z.enum(["it", "data", "security", "cloud"])
    .refine((val) => val, { message: "Category is required" }),

  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]{10,}$/.test(val), {
      message: "Please enter a valid phone number",
    }),

  startDate: z.date({
    message: "Contract start date is required",
  }),

  endDate: z.date({
    message: "Contract end date is required",
  }),

  files: z.array(z.instanceof(File)).optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;
