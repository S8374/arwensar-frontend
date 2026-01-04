/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/features/public/public.api.ts
import { baseApi } from "@/redux/baseApi";

export interface Plan {
  id: string;
  name: string;
  description: string;
  type: "STARTER" | "PROFESSIONAL" | "ENTERPRISE" | "FREE";
  billingCycle: "MONTHLY";
  price: string | number;
  currency: "EUR";
  supplierLimit: number | null;
  assessmentLimit: number | null;
  userLimit: number | null;
  features: Record<string, any>;
  trialDays: number;
  isPopular: boolean;
  stripePriceId: string;
}

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<{ data: Plan[] }, void>({
      query: () => ({
        url: "/admin/plans",
        method: "GET",
      }),
      providesTags: ["plan"],
    }),
  }),
});

export const { useGetPlansQuery } = publicApi;