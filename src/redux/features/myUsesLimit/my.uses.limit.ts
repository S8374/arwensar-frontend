/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";

/* =======================
   Types
======================= */



export interface CheckUsagePayload {
    type: "SUPPLIER" | "ASSESSMENT" | "USER";
    amount?: number; // default 1
}

export interface DecrementUsagePayload {
    type: "SUPPLIER" | "ASSESSMENT" | "USER";
    amount?: number; // default 1
}

export interface ResetUsagePayload {
    userId: string;
}

/* =======================
   API
======================= */

export const usageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 Get current user's usage
        getMyUsage: builder.query<any, void>({
            query: () => ({
                url: "/usage/my-access",
                method: "GET",
            }),
            providesTags: ["usage"],
        }),

        // 🔹 Check usage availability (no decrement)
        checkUsage: builder.mutation<any, CheckUsagePayload>({
            query: (payload) => ({
                url: "/usage/check-usage",
                method: "POST",
                body: payload,
            }),
        }),

        // 🔹 Decrement usage
        decrementUsage: builder.mutation<any, DecrementUsagePayload>({
            query: (payload) => ({
                url: "/usage/decrement-usage",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["usage"],
        }),

        // 🔹 Reset usage (ADMIN only)
        resetUsage: builder.mutation<any, ResetUsagePayload>({
            query: (payload) => ({
                url: "/usage/reset-usage",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["usage"],
        }),
    }),
});

/* =======================
   Hooks
======================= */

export const {
    useGetMyUsageQuery,
    useCheckUsageMutation,
    useDecrementUsageMutation,
    useResetUsageMutation,
} = usageApi;
