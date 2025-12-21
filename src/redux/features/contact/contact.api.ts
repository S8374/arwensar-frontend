import type { ContactApiResponse, ContactFormData } from "@/components/types/contact";
import { baseApi } from "@/redux/baseApi";

export const contactFromApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addContact: builder.mutation<ContactApiResponse, ContactFormData>({
      query: (contactData) => ({
        url: "/contact/send",
        method: "POST",
        data: contactData,
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const { useAddContactMutation } = contactFromApi;