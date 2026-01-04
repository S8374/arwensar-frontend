/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useForgotPassword.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import { forgotPasswordSchema, type ForgotPasswordData } from "@/validation/forgot-password";
import { toast } from "sonner";

export const useForgotPassword = () => {
  const [forgotPassword, { isLoading, isSuccess, isError }] = useForgotPasswordMutation();
  console.log("resetPassword",forgotPassword);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await forgotPassword({ email: data.email.trim().toLowerCase() }).unwrap();
      
      toast.success("Password reset link sent! Check your email (including spam).", {
        duration: 8000,
      });

      reset();
    } catch (err: any) {
      const message = err?.data?.message || "Failed to send reset link. Please try again.";
      toast.error(message);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    isError,
  };
};