// types/plan.ts
export interface PlanFeatureMap {
  [key: string]: string | boolean | number | null;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  type: string;
  billingCycle: string;
  price: string;
  currency: string;
  supplierLimit: number | null;
  assessmentLimit: number | null;
  storageLimit: number;
  userLimit: number | null;
  features: PlanFeatureMap;
  trialDays: number;
  originalPrice: string | null;
  isPopular: boolean;
  isActive: boolean;
  isDefault: boolean;
  isDeleted: boolean;
  stripePriceId: string;
  stripeProductId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  success: boolean;
  message: string;
  data: Plan[];
}

export interface PlanData {
  planId: string;
  planName: string;
  price: number;
  calculatedPrice: number;
  billingPeriod: 'monthly' | 'annual';
  discount: number;
  features: string[];
  isPopular: boolean;
}

export interface PricingTableProps {
  onPlanSelect?: (planData: PlanData) => void;
}