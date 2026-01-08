import { z } from "zod";

export const vendorProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().min(1),
  contactNumber: z.string().min(1),
  industryType: z.string().min(1),
  profileImage: z.string().optional(),
  companyLogo: z.string().optional(),
});

export const supplierProfileSchema = z.object({
  firstName: z.string().min(1),
  email: z.string().email(),
  contactNumber: z.string().min(1),
  profileImage: z.string().optional(),
});

export type VendorProfileData = z.infer<typeof vendorProfileSchema>;
export type SupplierProfileData = z.infer<typeof supplierProfileSchema>;
