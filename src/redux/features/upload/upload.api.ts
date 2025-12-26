// src/redux/features/upload/upload.api.ts
import { baseApi } from "@/redux/baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<{ url: string }, FormData>({
      query: (data) => ({
        url: "/uploade",       // Your backend route
        method: "POST",
        data: data,       // RTK Query automatically sets Content-Type for FormData
      }),
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
