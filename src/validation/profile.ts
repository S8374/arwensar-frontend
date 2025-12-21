import { z } from "zod";


export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"), // Read-only
  companyName: z.string().min(1, "Company name is required"), // Changed from 'company'
  contactNumber: z.string().min(1, "Phone number is required"), // Changed from 'phone'
  industryType: z.string().optional(), // Optional field
});



export type ProfileData = z.infer<typeof profileSchema>;