/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/features/notification/notification.api.ts
import { baseApi } from "@/redux/baseApi";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: any;
  isRead: boolean;
  isDeleted: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface MarkAsReadPayload {
  notificationIds?: string[];
  markAll?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
  priority?: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get notifications with filters
    getNotifications: builder.query<any, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),



    // Get notification stats
    getNotificationStats: builder.query<NotificationStats, void>({
      query: () => ({
        url: "/notifications/stats",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),

    // Mark notifications as read
    markNotificationAsRead: builder.mutation<{ message: string; count: number }, MarkAsReadPayload>({
      query: (body) => ({
        url: "/notifications/mark-read",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["notification"],
    }),

    // Delete specific notifications
    deleteNotifications: builder.mutation<{ message: string; count: number }, { notificationIds: string[] }>({
      query: (body) => ({
        url: "/notifications",
        method: "DELETE",
        data: body,
      }),
      invalidatesTags: ["notification"],
    }),

    // Get unread count
    getUnreadNotificationCount: builder.query<{ count: number }, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),

    // Clear all notifications
    clearAllNotifications: builder.mutation<{ message: string; count: number }, void>({
      query: () => ({
        url: "/notifications/clear-all",
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),

    // Create notification (admin/vendor use)
    createNotification: builder.mutation<Notification, any>({
      query: (body) => ({
        url: "/notifications/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["notification"],
    }),
    getTargetUsers: builder.query({
      query: () => ({
        url: "/notifications/targets",
        method: "GET",
      }),
      providesTags: ['notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationsMutation,
  useGetUnreadNotificationCountQuery,
  useClearAllNotificationsMutation,
  useCreateNotificationMutation,
  useGetTargetUsersQuery
} = notificationApi;