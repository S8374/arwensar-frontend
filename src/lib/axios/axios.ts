import config from "@/config";
import axios from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true,
});

// Simple request interceptor (optional)
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Simple response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here if needed
    return response;
  },
  async (error) => {
    // You can add custom error handling based on status codes
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      toast.error("Unauthorized access, redirecting to login...");
      // window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      toast.error("Access forbidden");
    }

    if (error.response?.status === 404) {
      toast.error("Resource not found");
    }

    if (error.response?.status >= 500) {
      toast.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);