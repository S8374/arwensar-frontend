/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type { ForgotPasswordData } from "@/validation/forgot-password";
import type { LoginFormData } from "@/validation/login";
import type { OTPFormData } from "@/validation/otp";
import type { UpdatePasswordData } from "@/validation/update-password";
import type { VendorFormData } from "@/validation/vendorValidation";

export type CreateVendorRequest = VendorFormData;
export type VerifyOTPRequest = OTPFormData;
export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Response types
export interface CreateVendorResponse {
  data: any;
  id: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  createdAt: string;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    company: string;
  };
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVendor: builder.mutation<CreateVendorResponse, CreateVendorRequest>({
      query: (vendorData) => ({
        url: "/auth/register",
        method: "POST",
        data: vendorData,
      }),
      invalidatesTags: ["vendor"],
    }),
    createSupplyer: builder.mutation<any, any>({
      query: (vendorData) => ({
        url: "/supplyer/register",
        method: "POST",
        data: vendorData,
      }),
      invalidatesTags: ["vendor"],
    }),
    login: builder.mutation({
      query: (loginData: LoginFormData) => ({
        url: "/auth/login",
        method: "POST",
        data: loginData,
      }),
      invalidatesTags: ["vendor"],
    }),
    // Verify Email with OTP
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        data: data,
      }),
    }),

    // Resend OTP
    resendOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        data: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (forgotPasswordData: ForgotPasswordData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: forgotPasswordData,
      }),
    }),
    changePassword: builder.mutation({
      query: (updatePasswordData: UpdatePasswordData) => ({
        url: "/auth/change-password",
        method: "POST",
        data: updatePasswordData,
      }),

    }),

    userInfo: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),
    // To this (correct):
    logOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        // body: {} // optional if backend expects it
      }),
      invalidatesTags: ["vendor"], // clears cached user data
    }),

    checkRecentOTP: builder.mutation<
      { canSend: boolean; secondsLeft: number },
      { email: string }
    >({
      query: ({ email }) => ({
        url: `/otp/recent?email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordData>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
         data, 
      }),
    }),

  }),
});

export const {
  useCreateVendorMutation,
  useForgotPasswordMutation,
  useCreateSupplyerMutation,
  useUserInfoQuery,
  useVerifyEmailMutation,
  useResendOTPMutation,
  useLogOutMutation,
  useLoginMutation,
  useCheckRecentOTPMutation,
  useChangePasswordMutation,
  useResetPasswordMutation
} = authApi;