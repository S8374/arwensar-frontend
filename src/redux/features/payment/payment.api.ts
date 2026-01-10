/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";

/* =====================
   TYPES
===================== */

interface CreateCheckoutPayload {
  planId: string;
  billingCycle: "MONTHLY" | "YEARLY";
}

interface CreateCheckoutResponse {
  success: boolean;
  message: string;
  data: {
    url: any;
    sessionId: string;
    checkoutUrl: string;
  };
}

interface SessionStatusResponse {
  success: boolean;
  data: {
    status: "open" | "complete" | "expired";
    paymentStatus: "paid" | "unpaid";
  };
}

/* =====================
   API
===================== */

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ---------- PLANS ---------- */

    getPlans: builder.query<any[], void>({
      query: () => ({
        url: "/payment/plans",
        method: "GET",
      }),
    }),

    getPlanById: builder.query<any, string>({
      query: (planId) => ({
        url: `/payment/plans/${planId}`,
        method: "GET",
      }),
    }),

    /* ---------- CHECKOUT ---------- */

    createCheckoutSession: builder.mutation<
      CreateCheckoutResponse,
      CreateCheckoutPayload
    >({
      query: (body) => ({
        url: "/payment/create-checkout-session",
        method: "POST",
        body, // ✅ FIXED
      }),
    }),

    getSessionStatus: builder.query<SessionStatusResponse, string>({
      query: (sessionId) => ({
        url: `/payment/session-status/${sessionId}`,
        method: "GET",
      }),
    }),

    confirmPayment: builder.mutation<any, { sessionId: string }>({
      query: (body) => ({
        url: "/payment/confirm-payment",
        method: "POST",
        body,
      }),
    }),

    /* ---------- SUBSCRIPTION ---------- */

    getCurrentSubscription: builder.query<any, void>({
      query: () => ({
        url: "/payment/current-subscription",
        method: "GET",
      }),
    }),

    cancelSubscription: builder.mutation<
      any,
      { cancelAtPeriodEnd?: boolean }
    >({
      query: (body) => ({
        url: "/payment/cancel-subscription",
        method: "POST",
        body,
      }),
    }),

    createPortalSession: builder.mutation<{ url: string }, { returnUrl: string }>(
      {
        query: (body) => ({
          url: "/payment/create-portal-session",
          method: "POST",
          body,
        }),
      }
    ),

    /* ---------- HISTORY ---------- */

    getPaymentHistory: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/payment/payment-history?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useCreateCheckoutSessionMutation,
  useGetSessionStatusQuery,
  useConfirmPaymentMutation,
  useGetCurrentSubscriptionQuery,
  useCancelSubscriptionMutation,
  useCreatePortalSessionMutation,
  useGetPaymentHistoryQuery,
} = paymentApi;
