/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";

interface CreateCheckoutPayload {
  planId: string;
  billingCycle: "MONTHLY";
}

interface CreateCheckoutResponse {
  success: boolean;
  message: string;
  data: {
    url: string | URL | undefined;
    client_secret: any;
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

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Stripe Checkout Session
    createCheckoutSession: builder.mutation<
      CreateCheckoutResponse,
      CreateCheckoutPayload
    >({
      query: (data) => ({
        url: "/payment/create-checkout-session",
        method: "POST",
        data : data,
      }),
    }),

    // Check Checkout Session Status
    getSessionStatus: builder.query<
      SessionStatusResponse,
      string
    >({
      query: (sessionId) => ({
        url: `/payment/session-status/${sessionId}`,
        method: "GET",
      }),
    }),

    // Create Stripe Customer Portal Session
    createPortalSession: builder.mutation<
      { url: string },
      void
    >({
      query: () => ({
        url: "/payment/create-portal-session",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetSessionStatusQuery,
  useCreatePortalSessionMutation,
} = paymentApi;
