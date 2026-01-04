import { z } from "zod";

export const pricingPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  price: z.number().min(0, "Price must be positive"),
  isAnnual: z.boolean(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  buttonText: z.string().min(1, "Button text is required"),
});

export type PricingPlanData = z.infer<typeof pricingPlanSchema>;

export interface PlanFeature {
  name: string;
  starter: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

export interface PlanData {
  planName: string;
  price: number;
  billingPeriod: string;
  features: string[];
  selectedFeature: string;
}

export interface PricingTableProps {
  onPlanSelect?: (planData: PlanData) => void;
}