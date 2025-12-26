// src/redux/features/verification/verification.api.ts
import { baseApi } from "@/redux/baseApi";

export const verificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send verification email
    sendVerification: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/verification/send-verification",
        method: "POST",
        data,
      }),
      invalidatesTags: ['Verification'],
    }),
    
    // Verify email with token (using query parameter)
    verifyEmail: builder.mutation({
      query: (token: string) => ({
        url: `/verification/verify`,
        method: "GET",
        params: { token },
      }),
      invalidatesTags: [ 'Verification'],
    }),
    
    // Check verification status
    checkVerificationStatus: builder.query({
      query: () => ({
        url: "/verification/status",
        method: "GET",
      }),
      providesTags: ['Verification'],
    }),
    
    // Resend verification email
    resendVerification: builder.mutation({
      query: () => ({
        url: "/verification/resend",
        method: "POST",
      }),
      invalidatesTags: ['Verification'],
    }),
  }),
});

export const {
  useSendVerificationMutation,
  useVerifyEmailMutation,
  useCheckVerificationStatusQuery,
  useResendVerificationMutation,
} = verificationApi;