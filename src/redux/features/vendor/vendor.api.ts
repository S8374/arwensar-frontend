import { baseApi } from "@/redux/baseApi";
import type { AlertData } from "@/validation/alert";
import type { ProfileData } from "@/validation/profile";
import type { SupplierFormData } from "@/validation/supplier";
// src/types/assessment.ts
export type ReviewAssessmentPayload = {
    status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION' | 'UNDER_REVIEW';
    reviewComments?: string;
    reviewerReport?: string;
};
export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addSupplier: builder.mutation({
            query: (payload: SupplierFormData & { files?: File[] }) => ({
                url: "/vendor",
                method: "POST",
                data: payload,
            }),
            invalidatesTags: ["vendor"],
        }),
        importSupplyer: builder.mutation({
            query: (supplierData: { files?: File[] }) => ({
                url: "/vendor/import-suppliers",
                method: "POST",
                data: supplierData, //need modify
            }),
            invalidatesTags: ["vendor"],
        }),
        vendorProfileManagement: builder.mutation({
            query: (profileData: ProfileData) => ({
                url: "/profile/vendor/update-profile",
                method: "PATCH",
                data: profileData,
            }),
            invalidatesTags: ["vendor"],
        }),
        sendAlertSupplyer: builder.mutation({
            query: (alertData: AlertData & { supplierId?: string }) => ({
                url: "/vendor/send-alert",
                method: "POST",
                data: alertData,
            }),
            invalidatesTags: ["vendor"],
        }),
        // Correct: Use query for GET
        getMySuppliers: builder.query({
            query: () => ({
                url: "/vendor/suppliers",        // Correct endpoint
                method: "GET",
            }),
            providesTags: ["vendor"], // Important: provides, not invalidates
        }),
        getSupplierById: builder.query({
            query: (supplierId: string) => ({
                url: `/vendor/${supplierId}`,  // Update to use suppliers endpoint
                method: "GET",
            }),
            providesTags: ["vendor"],
        }),
        getAllAssainment: builder.query({
            query: () => ({
                url: "/admin/assessments",        // Correct endpoint
                method: "GET",
            }),
            providesTags: ["vendor"], // Important: provides, not invalidates
        }),
        getSubmissionById: builder.query({
            query: (supplierId: string) => ({
                url: `/assessments/my-submissions/${supplierId}`,  // Update to use suppliers endpoint
                method: "GET",
            }),
            providesTags: ["vendor"],
        }),
        getAssainmentById: builder.query({
            query: (assainmentId: string) => ({
                url: `/assessments/${assainmentId}`,  // Update to use suppliers endpoint
                method: "GET",
            }),
            providesTags: ["vendor"],
        }),
        // redux/features/vendor/vendor.api.ts

        reviewAssainment: builder.mutation({
            query: ({ submissionID, body }) => ({
                url: `/assessments/review/${submissionID}`,
                method: "PATCH",
                data: body, // send body object

            }),
            invalidatesTags: ["vendor"],
        }),
        getSupplyerProgress: builder.query({
            query: () => ({
                url: "/assessments/suppliers/progress",        // Correct endpoint
                method: "GET",
            }),
            providesTags: ["vendor"], // Important: provides, not invalidates
        }),
        getSingelSupplyerProgress: builder.query({
            query: (supplierId: string) => ({
                url: `/assessments/suppliers/progress/${supplierId}`,  // Update to use suppliers endpoint
                method: "GET",
            }),
            providesTags: ["vendor"],
        }),

        getDashboardStats: builder.query({
            query: () => ({
                url: "/vendor/my/dashboard-stats",  // Changed from "/vendor/dashboard/stats"
                method: "GET",
            }),
            providesTags: ["vendor"],
        }),

        getVendorStats: builder.query({  // Renamed for clarity
            query: () => ({
                url: "/vendor/my/stats",  // Changed from "/vendor/dashboard-data"
                method: "GET",
            }),
            providesTags: ["vendor"],
        }),
        getNewDashboardData: builder.query({
            query: () => ({
                url: "/dashboard/vendor/my/stats",  // Backend endpoint
                method: "GET",
            }),
            providesTags: ["vendor"], // Optional: cache tag
        }),

    }),
});

export const {
    useAddSupplierMutation,
    useImportSupplyerMutation,
    useVendorProfileManagementMutation,
    useSendAlertSupplyerMutation,
    useGetMySuppliersQuery,
    useGetSupplierByIdQuery,
    useGetSubmissionByIdQuery,
    useGetAllAssainmentQuery,
    useGetAssainmentByIdQuery,
    useReviewAssainmentMutation,
    useLazyGetSupplierByIdQuery,
    useLazyGetSingelSupplyerProgressQuery,
    useGetDashboardStatsQuery,
    useGetVendorStatsQuery, // Updated export name,
    useGetNewDashboardDataQuery
} = vendorApi;