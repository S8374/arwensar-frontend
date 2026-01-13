/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";


/* ===================== ADMIN API ===================== */

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= DASHBOARD =================
    getAdminDashboardStats: builder.query<any, void>({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    // ================= PLANS =================
    createPlan: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["plan"],
    }),

    updatePlan: builder.mutation<any, any>({
      query: ({ planId, ...data }) => ({
        url: `/admin/plans/${planId}`,
        method: "PATCH",
      data: data,
      }),
      invalidatesTags: ["plan"],
    }),

    deletePlan: builder.mutation<void, string>({
      query: (planId) => ({
        url: `/admin/plans/${planId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["plan"],
    }),

    getPlanById: builder.query<any, string>({
      query: (planId) => ({
        url: `/admin/plans/${planId}`,
        method: "GET",
      }),
    }),

    // ================= ASSESSMENTS =================
    createAssessment: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/assessments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assessment"],
    }),

    getAllAssessments: builder.query<any, void>({
      query: () => ({
        url: "/admin/assessments",
        method: "GET",
      }),
      providesTags: ["assessment"],
    }),
    // ─── NEW: Update assessment ───
    updateAssessment: builder.mutation<any, { assessmentId: string; data: any }>({
      query: ({ assessmentId, data }) => ({
        url: `/admin/assessments/${assessmentId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { assessmentId }) => [
        { type: "assessment", id: assessmentId },
        "assessment",
      ],
    }),

    // ─── NEW: Delete (deactivate) assessment ───
    deleteAssessment: builder.mutation<void, string>({
      query: (assessmentId) => ({
        url: `/admin/assessments/${assessmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, assessmentId) => [
        { type: "assessment", id: assessmentId },
        "assessment",
      ],
    }),
    // ================= USERS =================
    getAllUsers: builder.query<any, void>({
      query: () => ({
        url: "/admin/all-users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation<any, { userId: string; data: any }>({
      query: ({ userId, data }) => ({
        url: `/admin/user/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

toggleUserBlock: builder.mutation<void, { userId: string; block: boolean }>({
  query: ({ userId, block }) => ({
    url: `/admin/user/${userId}/block`,
    method: "PATCH",
    data: { block }, // <-- send block status here
  }),
  invalidatesTags: ["User"],
})

,
    permanentDeleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/users/permanent/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    bulkDeleteUsers: builder.mutation<void, { userIds: string[] }>({
      query: (data) => ({
        url: "/admin/users/bulk-delete",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["User"],
    }),

    bulkUpdateUsers: builder.mutation<void, any>({
      query: (data) => ({
        url: "/admin/users/bulk-update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    bulkBlockUsers: builder.mutation<void, any>({
      query: (data) => ({
        url: "/admin/users/bulk-block",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["User"],
    }),

    bulkVerifyUsers: builder.mutation<void, any>({
      query: (data) => ({
        url: "/admin/users/bulk-verify",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["User"],
    }),

    deactivateInactiveUsers: builder.mutation<void, void>({
      query: () => ({
        url: "/admin/users/deactivate-inactive",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    exportUsersToCSV: builder.mutation<Blob, void>({
      query: () => ({
        url: "/admin/users/export-csv",
        method: "POST",
        responseHandler: (response: { blob: () => any; }) => response.blob(),
      }),
    }),

    // ================= SUPPLIERS / VENDORS =================
    getAllSuppliers: builder.query<any, void>({
      query: () => ({
        url: "/admin/suppliers",
        method: "GET",
      }),
      providesTags: ["supplier"],
    }),

    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["supplier"],
    }),

    getAllVendors: builder.query<any, void>({
      query: () => ({
        url: "/admin/vendors",
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),

    // ================= REPORTS =================
    generateReport: builder.mutation<any, string>({
      query: (type) => ({
        url: `/admin/reports/${type}`,
        method: "POST",
      }),
    }),
  }),
});

/* ===================== EXPORT HOOKS ===================== */

export const {
  useGetAdminDashboardStatsQuery,

  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetPlanByIdQuery,

  useCreateAssessmentMutation,
  useGetAllAssessmentsQuery,
  useUpdateAssessmentMutation,
  useDeleteAssessmentMutation,

  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserBlockMutation,
  usePermanentDeleteUserMutation,
  useBulkDeleteUsersMutation,
  useBulkUpdateUsersMutation,
  useBulkBlockUsersMutation,
  useBulkVerifyUsersMutation,
  useDeactivateInactiveUsersMutation,
  useExportUsersToCSVMutation,

  useGetAllSuppliersQuery,
  useDeleteSupplierMutation,
  useGetAllVendorsQuery,

  useGenerateReportMutation,
} = adminApi;
