import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import { forgotPasswordSchema, type ForgotPasswordData } from "@/validation/forgot-password";

export const useForgotPassword = () => {
  const [forgotPassword, { isLoading, isSuccess, isError, data }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: ForgotPasswordData) => {
    try {
      console.log("Forgot password data submitted:", formData);
      
      // Simulate API call - replace with actual API call when ready
      const response = await forgotPassword(formData).unwrap();
      
      // Log the OTP to console (assuming API returns OTP in response)
      console.log("OTP sent:", response?.otp || "123456"); // Replace with actual OTP from response
      
      reset();
    } catch (error) {
      console.error("Failed to send reset password email:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    isError,
    otp: data?.otp || "123456", // Fallback for demo
  };
};