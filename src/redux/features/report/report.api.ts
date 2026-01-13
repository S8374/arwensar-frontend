/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/features/report/report.api.ts
import { baseApi } from "@/redux/baseApi";

/* ================= TYPES ================= */

export type GenerateReportPayload = {
  title: string;
  description?: string;
  reportType:
  | "RISK_ASSESSMENT"
  | "COMPLIANCE_REPORT"
  | "SUPPLIER_EVALUATION"
  | "FINANCIAL_ANALYSIS";
  vendorId?: string;
  supplierId?: string;
  parameters?: Record<string, any>;
  filters?: {
    riskLevel?: string[];
    startDate?: string;
    endDate?: string;
    status?: string[];
  };
};

export type UpdateReportPayload = {
  title?: string;
  description?: string;
  status?: "GENERATED" | "VIEWED" | "SENT" | "ARCHIVED";
};


/* ================= API ================= */

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========= GENERATE =========
    generateReport: builder.mutation<any, any>({
      query: (body) => ({
        url: "/reports",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Report"],
    }),

    bulkGenerateReports: builder.mutation<any, any>({
      query: (body) => ({
        url: "/reports/bulk",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Report"],
    }),

    uploadExternalReport: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/reports/upload",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Report"],
    }),

    // ========= GET =========
    getReports: builder.query<any, any>({
      query: (params) => ({
        url: "/reports",
        method: "GET",
        params,
      }),
      providesTags: ["Report"],
    }),

    getReportById: builder.query<any, string>({
      query: (reportId) => ({
        url: `/reports/${reportId}`,
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getReportStatistics: builder.query<any, void>({
      query: () => ({
        url: "/reports/statistics",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    getVendorReportOptions: builder.query<any, void>({
      query: () => ({
        url: "/reports/vendor/options",
        method: "GET",
      }),
    }),

    // ========= DOCUMENT =========
    getReportDocument: builder.mutation<Blob, string>({
      query: (reportId) => ({
        url: `/reports/${reportId}/document`,
        method: "GET",
        responseHandler: (response: Response) => response.blob(),
      }),
    }),

    getReportDocumentUrl: builder.query<any, string>({
      query: (reportId) => ({
        url: `/reports/${reportId}/document/url`,
        method: "GET",
      }),
    }),

    // ========= UPDATE / DELETE =========
    updateReport: builder.mutation<
      any,
      { reportId: string; body: UpdateReportPayload }
    >({
      query: ({ reportId, body }) => ({
        url: `/reports/${reportId}`,
        method: "PUT", // ✅ backend uses PUT
        data: body,
      }),
      invalidatesTags: ["Report"],
    }),

    deleteReport: builder.mutation<any, string>({
      query: (reportId) => ({
        url: `/reports/${reportId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Report"],
    }),

    // ========= SEND =========
    sendReport: builder.mutation<
      any,
      { reportId: string; recipientEmail?: string }
    >({
      query: ({ reportId, recipientEmail }) => ({
        url: `/reports/${reportId}/send`,
        method: "POST",
        data: { recipientEmail },
      }),
      invalidatesTags: ["Report"],
    }),
  }),
});

/* ================= HOOKS ================= */

export const {
  useGenerateReportMutation,
  useBulkGenerateReportsMutation,
  useUploadExternalReportMutation,
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGetReportStatisticsQuery,
  useGetVendorReportOptionsQuery,
  useGetReportDocumentMutation,
  useGetReportDocumentUrlQuery,
  useUpdateReportMutation,
  useDeleteReportMutation,
  useSendReportMutation,
} = reportApi;
