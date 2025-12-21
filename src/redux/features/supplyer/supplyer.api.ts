import { baseApi } from "@/redux/baseApi";
export interface CompleteSupplierRegistrationRequest {
    password: string;
    confirmPassword: string;
    invitationToken: string;
}

export interface SupplierRegistrationResponse {
    success: boolean;
    message: string;
    data: {
        supplier: any;
        user: {
            id: string;
            email: string;
            role: string;
            isVerified: boolean;
        };
    };
}

export interface VerifyInvitationResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        name: string;
        contactPerson: string;
        email: string;
        vendor: {
            companyName: string;
            firstName: string;
            lastName: string;
        };
    };
}
export const supplyerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        buyNewPrice: builder.mutation({
            query: (contactData) => ({
                url: "/supplyer/buy",
                method: "POST",
                data: contactData,
            }),
            invalidatesTags: ["supplyer"],
        }),
        buyPlanFeatures: builder.mutation({
            query: (contactData) => ({
                url: "/supplyer/plan-features",
                method: "POST",
                data: contactData,
            }),
            invalidatesTags: ["supplyer"],
        }),
        completeSupplierRegistration: builder.mutation<
            SupplierRegistrationResponse,
            CompleteSupplierRegistrationRequest
        >({
            query: (registrationData) => ({
                url: "/supplier/complete-registration",
                method: "POST",
                data: registrationData,
            }),
        }),

        verifyInvitation: builder.mutation<
            VerifyInvitationResponse,
            string
        >({
            query: (token) => ({
                url: `/supplier/verify-invitation/${token}`,
                method: "GET",
            }),
        }),
        submitAssessment: builder.mutation<
            any, // response type (you can create a proper type later)
            { assessmentId: string; answers: any[] }
        >({
            query: (body) => ({
                url: "/assessments/submit", // WRONG - should be "/supplier/submit"
                method: "POST",
                data: body,
            }),
            invalidatesTags: ["supplyer"], // refreshes any queries with this tag
        }),
        getDrafAssainmentByAssainmentID: builder.query({
            query: (assainmentId: string) => ({
                url: `/assessments/draft/${assainmentId}`,  // Update to use suppliers endpoint
                method: "GET",
            }),
            providesTags: ["supplyer"],
        }),
        saveDarftAssainment: builder.mutation({
            query: (body) => ({
                url: "/assessments/draft", // WRONG - should be "/supplier/submit"
                method: "POST",
                data: body,
            }),
            invalidatesTags: ["supplyer"], // refreshes any queries with this tag
        }),
        notifyMyVendor: builder.mutation({
            query: (body) => ({
                url: "/problems", // WRONG - should be "/supplier/submit"
                method: "POST",
                data: body,
            }),
            invalidatesTags: ["supplyer"], // refreshes any queries with this tag
        })
    }),
});

export const {
    useBuyNewPriceMutation,
    useBuyPlanFeaturesMutation,
    useCompleteSupplierRegistrationMutation,
    useVerifyInvitationMutation,
    useSubmitAssessmentMutation,
    useGetDrafAssainmentByAssainmentIDQuery,
    useSaveDarftAssainmentMutation,
    useNotifyMyVendorMutation
} = supplyerApi;