/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ================= PROFILE =================
        getUserProfile: builder.query<any, void>({
            query: () => ({
                url: "/user/profile",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

        updateUserProfile: builder.mutation<any, any>({
            query: (data) => ({
                url: "/user/profile",
                method: "PATCH",
                data: data,
            }),
            invalidatesTags: ["User"],
        }),

        // ================= PASSWORD =================
        updatePassword: builder.mutation<any, any>({
            query: (data) => ({
                url: "/user/password",
                method: "PATCH",
                data: data,
            }),
        }),

        // ================= NOTIFICATIONS =================
        getNotificationPreferences: builder.query<any, void>({
            query: () => ({
                url: "/user/notifications/preferences",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

        updateNotificationPreferences: builder.mutation<any, any>({
            query: (data) => ({
                url: "/user/notifications/preferences",
                method: "PATCH",
                data: data,
            }),
            invalidatesTags: ["User"],
        }),

        // ================= ACTIVITY LOGS =================
        getActivityLogs: builder.query<any, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: "/user/activity-logs",
                method: "GET",
                params: { page, limit },
            }),
        }),

        // ================= SEARCH =================
        searchUsers: builder.query<any, { query: string; role?: string }>({
            query: ({ query, role }) => ({
                url: "/user/search",
                method: "GET",
                params: {
                    q: query,
                    role,
                },
            }),
        }),

    }),
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useUpdatePasswordMutation,
    useGetNotificationPreferencesQuery,
    useUpdateNotificationPreferencesMutation,
    useGetActivityLogsQuery,
    useSearchUsersQuery,
} = userApi;
