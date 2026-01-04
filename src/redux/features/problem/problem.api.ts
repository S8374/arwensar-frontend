/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/features/problem/problem.api.ts
import { baseApi } from "@/redux/baseApi";

export type CreateProblemPayload = {
  title: string;
  description: string;
  assessmentId?: string;
  submissionId?: string;
  content?:string
};

export type UpdateProblemPayload = {
  title?: string;
  description?: string;
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
};

export type CreateMessagePayload = {
  message: string;
};

export const problemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Create problem
    createProblem: builder.mutation<any, CreateProblemPayload>({
      query: (body) => ({
        url: "/problems",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["problem"],
    }),

    // Get all problems
    getProblems: builder.query<any, void>({
      query: () => ({
        url: "/problems",
        method: "GET",
      }),
      providesTags: ["problem"],
    }),

    // Get problem by ID
    getProblemById: builder.query<any, string>({
      query: (problemId) => ({
        url: `/problems/${problemId}`,
        method: "GET",
      }),
      providesTags: ["problem"],
    }),

    // Update problem
    updateProblem: builder.mutation<
      any,
      { problemId: string; body: UpdateProblemPayload }
    >({
      query: ({ problemId, body }) => ({
        url: `/problems/${problemId}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["problem"],
    }),

    // Delete problem
    deleteProblem: builder.mutation<any, string>({
      query: (problemId) => ({
        url: `/problems/${problemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["problem"],
    }),

    // Create message inside a problem
    createProblemMessage: builder.mutation<
      any,
      { problemId: string; body: CreateMessagePayload }
    >({
      query: ({ problemId, body }) => ({
        url: `/problems/${problemId}/messages`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["problem"],
    }),

    // Get problem statistics
    getProblemStatistics: builder.query<any, void>({
      query: () => ({
        url: "/problems/statistics",
        method: "GET",
      }),
      providesTags: ["problem"],
    }),
  }),
});

export const {
  useCreateProblemMutation,
  useGetProblemsQuery,
  useGetProblemByIdQuery,
  useUpdateProblemMutation,
  useDeleteProblemMutation,
  useCreateProblemMessageMutation,
  useGetProblemStatisticsQuery,
} = problemApi;
