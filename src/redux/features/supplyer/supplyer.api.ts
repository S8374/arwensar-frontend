/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/features/supplier/supplier.api.ts
import { baseApi } from "@/redux/baseApi";

export interface CompleteSupplierRegistrationRequest {
  password: string;
  confirmPassword: string;
  invitationToken: string;
}

export const supplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Dashboard
    getSupplierDashboard: builder.query<any, void>({
      query: () => ({
        url: "/supplier/dashboard",
        method: "GET",
      }),
      providesTags: ["supplier"],
    }),

    // Profile
    getSupplierProfile: builder.query<any, void>({
      query: () => ({
        url: "/supplier/profile",
        method: "GET",
      }),
      providesTags: ["supplier"],
    }),

// Correct mutation – supplierId in URL, body as data
updateSupplierProfile: builder.mutation<any, { supplierId: string; data: Partial<any> }>({
  query: ({ supplierId, data }) => ({
    url: `/supplier/profile/${supplierId}`, // Correct URL with supplierId as param
    method: "PATCH",
    data: data, // req.body in backend
  }),
  invalidatesTags: ["supplier"], // Will refetch getSupplierById etc.
}),

    // Supplier assessments
    getSupplierAssessments: builder.query<any, void>({
      query: () => ({
        url: "/supplier/assessments",
        method: "GET",
      }),
      providesTags: ["supplier"],
    }),

    startSupplierAssessment: builder.mutation<any, { assessmentId: string }>({
      query: ({ assessmentId }) => ({
        url: `/supplier/assessments/${assessmentId}/start`,
        method: "POST",
      }),
      invalidatesTags: ["supplier"],
    }),

    saveSupplierAnswer: builder.mutation<
      any,
      { submissionId: string; questionId: string; body: any }
    >({
      query: ({ submissionId, questionId, body }) => ({
        url: `/supplier/submissions/${submissionId}/answers/${questionId}`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["supplier"],
    }),

    submitSupplierAssessment: builder.mutation<any, { submissionId: string }>({
      query: ({ submissionId }) => ({
        url: `/supplier/submissions/${submissionId}/submit`,
        method: "POST",
      }),
      invalidatesTags: ["supplier"],
    }),

    // Invitation
    verifyInvitation: builder.query<any, string>({
      query: (token) => ({
        url: `/supplier/verify-invitation/${token}`,
        method: "GET",
      }),
    }),
    // ================= SUPPLIER CONTRACT DASHBOARD =================
    getMyContractStatus: builder.query({
      query: () => ({
        url: "/supplier/contract", // uses req.user.supplierId
        method: "GET",
      }),
      providesTags: ["supplier"],
    }),
    completeSupplierRegistration: builder.mutation<
      any,
      CompleteSupplierRegistrationRequest
    >({
      query: (body) => ({
        url: "/supplier/complete-registration",
        method: "POST",
        data: body,
      }),

    }),
  }),
});

export const {
  useGetSupplierDashboardQuery,
  useGetSupplierProfileQuery,
  useUpdateSupplierProfileMutation,
  useGetSupplierAssessmentsQuery,
  useStartSupplierAssessmentMutation,
  useSaveSupplierAnswerMutation,
  useSubmitSupplierAssessmentMutation,
  useVerifyInvitationQuery,
  useCompleteSupplierRegistrationMutation,
  useGetMyContractStatusQuery,

} = supplierApi;
