// src/redux/features/notification/notification.api.ts
import { baseApi } from "@/redux/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationPreferences: builder.query({
      query: () => ({
        url: "/notifications/preferences",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),

    updateNotificationPreferences: builder.mutation({
      query: (preferences) => ({
        url: "/notifications/preferences",
        method: "PATCH",
        data: preferences,
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = notificationApi;