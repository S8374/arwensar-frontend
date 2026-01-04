/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/features/activity/activity.api.ts
import { baseApi } from "@/redux/baseApi";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyActivity: builder.query<any, void>({
      query: () => ({
        url: "/activity/me",
        method: "GET",
      }),
      providesTags: ["activity"],
    }),

    getRecentActivity: builder.query<any, void>({
      query: () => ({
        url: "/activity/recent",
        method: "GET",
      }),
      providesTags: ["activity"],
    }),

    getActivityByUserId: builder.query<any, string>({
      query: (userId) => ({
        url: `/activity/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["activity"],
    }),
  }),
});

export const {
  useGetMyActivityQuery,
  useGetRecentActivityQuery,
  useGetActivityByUserIdQuery,
} = activityApi;
