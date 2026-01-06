import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["contact", "vendor", "otp", "supplier", "Verification", "notification", "assessment", "report", "problem", "Document", "User","Report","activity","plan","Dashboard"],
  endpoints: () => ({}),
});