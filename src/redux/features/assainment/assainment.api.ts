/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/features/assessment/assessment.api.ts
import { baseApi } from "@/redux/baseApi";

export type ReviewAssessmentPayload = {
  status: "APPROVED" | "REJECTED" | "NEEDS_REVISION" | "UNDER_REVIEW";
  reviewComments?: string;
  reviewerReport?: string;
};

export const assessmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Get all assessments
    getAssessments: builder.query<any, void>({
      query: () => ({
        url: "/assessments",
        method: "GET",
      }),
      providesTags: ["assessment"],
    }),

    // Get assessment by ID
    getAssessmentById: builder.query<any, string>({
      query: (assessmentId) => ({
        url: `/assessments/${assessmentId}`,
        method: "GET",
      }),
      providesTags: ["assessment"],
    }),
    // Get submission User by ID
    getAssessmentUserById: builder.query<any, string>({
      query: (userId) => ({
        url: `/assessments/user/${userId}/submissions`,
        method: "GET",
      }),
      providesTags: ["assessment"],
    }),

    // Start assessment
    startAssessment: builder.mutation<any, { assessmentId: string }>({
      query: (body) => ({
        url: "/assessments/start",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["assessment"],
    }),

    // Save answer
    saveAnswer: builder.mutation<
      any,
      { submissionId: string; questionId: string; body: any }
    >({
      query: ({ submissionId, questionId, body }) => ({
        url: `/assessments/submissions/${submissionId}/answers/${questionId}`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["assessment"],
    }),

    // Submit assessment
    submitAssessment: builder.mutation<any, { submissionId: string }>({
      query: ({ submissionId }) => ({
        url: `/assessments/submissions/${submissionId}/submit`,
        method: "POST",
      }),
      invalidatesTags: ["assessment"],
    }),

    // Review assessment (Vendor/Admin)
    reviewAssessment: builder.mutation<
      any,
      { submissionId: string; body: ReviewAssessmentPayload }
    >({
      query: ({ submissionId, body }) => ({
        url: `/assessments/submissions/${submissionId}/review`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["assessment"],
    }),

    // Review evidence
    reviewEvidence: builder.mutation<
      any,
      { answerId: string; data: any }
    >({
      query: ({ answerId, data }) => ({
        url: `/assessments/evidence/${answerId}/review`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["assessment"],
    }),

    // Request evidence
    requestEvidence: builder.mutation<any, { answerId: string }>({
      query: ({ answerId }) => ({
        url: `/assessments/evidence/${answerId}/request`,
        method: "POST",
      }),
      invalidatesTags: ["assessment"],
    }),
    // Get submission by ID
    getSubmissionById: builder.query({
      query: (submissionId: string) => ({
        url: `/submissions/${submissionId}`,
        method: 'GET',
      }),
      providesTags: ['assessment'],
    }),
    // Statistics
    getAssessmentStatistics: builder.query<any, void>({
      query: () => ({
        url: "/assessments/statistics/all",
        method: "GET",
      }),
      providesTags: ["assessment"],
    }),
    getMySubmissions: builder.query<any, void>({
      query: () => ({
        url: "/assessments/submissions/all",
        method: "GET",
      }),
      providesTags: ["assessment"],
    }),
    removeEvidence: builder.mutation({
      query: ({ answerId }) => ({
        url: `/assessments/evidence/${answerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['assessment'],
    }),
  }),
});

export const {
  useGetAssessmentsQuery,
  useGetAssessmentByIdQuery,
  useStartAssessmentMutation,
  useSaveAnswerMutation,
  useSubmitAssessmentMutation,
  useReviewAssessmentMutation,
  useReviewEvidenceMutation,
  useRequestEvidenceMutation,
  useGetAssessmentStatisticsQuery,
  useGetSubmissionByIdQuery,
  useRemoveEvidenceMutation ,
  useGetMySubmissionsQuery,
  useGetAssessmentUserByIdQuery
} = assessmentApi;
