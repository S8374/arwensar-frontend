/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";

export const documentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ================= Upload Document =================
        uploadDocument: builder.mutation<any, any>({
            query: (data) => ({
                url: "/documents/upload",
                method: "POST",
                data: data,
            }),
            invalidatesTags: ["Document"],
        }),

        // ================= Get All Documents =================
        getDocuments: builder.query<any, any>({
            query: (params) => ({
                url: "/documents",
                method: "GET",
                params,
            }),
            providesTags: ["Document"],
        }),

        // ================= Get Document By ID =================
        getDocumentById: builder.query<any, string>({
            query: (documentId) => ({
                url: `/documents/${documentId}`,
                method: "GET",
            }),
            providesTags: ["Document"],
        }),
        // ================= Get User Document By ID =================
        // In document.api.ts - Fix the URL
        getDocumetByUserId: builder.query({
            query: (supplierId: string) => ({
                url: `/documents/user/${supplierId}`,  // ← Fix: Use correct endpoint
                method: "GET",
            }),
            providesTags: ["Document"],
        }),
        // ================= Update Document =================
        updateDocument: builder.mutation<
            any,
            { documentId: string; data: any }
        >({
            query: ({ documentId, data }) => ({
                url: `/documents/${documentId}`,
                method: "PATCH",
                data: data,
            }),
            invalidatesTags: ["Document"],
        }),

        // ================= Review Document =================
        reviewDocument: builder.mutation< any, { documentId: string; payload : any }>({
            query: ({ documentId, payload  }) => ({
                url: `/documents/${documentId}/review`,
                method: "POST",
                data: payload ,
            }),
            invalidatesTags: ["Document"],
        }),

        // ================= Delete Document =================
        deleteDocument: builder.mutation<any, string>({
            query: (documentId) => ({
                url: `/documents/${documentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Document"],
        }),

        // ================= Document Statistics =================
        getDocumentStatistics: builder.query<any, void>({
            query: () => ({
                url: "/documents/statistics/overview",
                method: "GET",
            }),
        }),

        // ================= Document Categories =================
        getDocumentCategories: builder.query<any, void>({
            query: () => ({
                url: "/documents/categories/all",
                method: "GET",
            }),
        }),

        // ================= Expiring Documents =================
        getExpiringDocuments: builder.query<any, any>({
            query: (params) => ({
                url: "/documents/expiring/soon",
                method: "GET",
                params,
            }),
        }),

        // ================= Bulk Update Status =================
        bulkUpdateDocumentStatus: builder.mutation<any, any>({
            query: (payload) => ({
                url: "/documents/bulk/update-status",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Document"],
        }),

        // ================= Check Expired (Admin) =================
        checkExpiredDocuments: builder.mutation<any, void>({
            query: () => ({
                url: "/documents/admin/check-expired",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useUploadDocumentMutation,
    useGetDocumentsQuery,
    useGetDocumentByIdQuery,
    useUpdateDocumentMutation,
    useReviewDocumentMutation,
    useDeleteDocumentMutation,
    useGetDocumentStatisticsQuery,
    useGetDocumentCategoriesQuery,
    useGetExpiringDocumentsQuery,
    useBulkUpdateDocumentStatusMutation,
    useCheckExpiredDocumentsMutation,
    useGetDocumetByUserIdQuery
} = documentApi;
