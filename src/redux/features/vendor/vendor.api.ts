import { baseApi } from "@/redux/baseApi";
import type { AlertData } from "@/validation/alert";
import type { ProfileData } from "@/validation/profile";
import type { SupplierFormData } from "@/validation/supplier";

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSupplier: builder.mutation({
      query: (data: SupplierFormData & { files?: File[] }) => ({
        url: "/vendor/suppliers/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["vendor"],
    }),

    importSupplyer: builder.mutation({
      query: (payload: { files?: File[] }) => ({
        url: "/vendor/import-suppliers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["vendor"],
    }),

    vendorProfileManagement: builder.mutation({
      query: (profileData: ProfileData) => ({
        url: "/profile/vendor/update-profile",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["vendor"],
    }),

    sendAlertSupplyer: builder.mutation({
      query: (alertData: AlertData & { supplierId?: string }) => ({
        url: "/vendor/send-alert",
        method: "POST",
        body: alertData,
      }),
      invalidatesTags: ["vendor"],
    }),

    getMySuppliers: builder.query({
      query: () => ({
        url: "/vendor/suppliers",
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),

    getSupplierById: builder.query({
      query: (supplierId: string) => ({
        url: `/vendor/suppliers/${supplierId}`,
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),

    getSingelSupplyerProgress: builder.query({
      query: (supplierId: string) => ({
        url: `/vendor/suppliers/${supplierId}/progress`,
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),

    getDashboardStats: builder.query({
      query: () => ({
        url: "/vendor/my/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),

    getVendorStats: builder.query({
      query: () => ({
        url: "/vendor/my/stats",
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),
    bulkImportSuppliers: builder.mutation({
      query: (suppliersData) => ({
        url: "/vendor/bulk-import",
        method: "POST",
        data: suppliersData,
      }),
      invalidatesTags: ["vendor"],
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
  useLazyGetSupplierByIdQuery,
  useLazyGetSingelSupplyerProgressQuery,
  useGetDashboardStatsQuery,
  useGetVendorStatsQuery,
  useBulkImportSuppliersMutation
} = vendorApi;
