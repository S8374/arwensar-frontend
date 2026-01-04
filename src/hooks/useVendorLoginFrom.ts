// src/hooks/useLoginForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormData } from "@/validation/login";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginVendor, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched", // better UX: validate on blur/touch
    defaultValues: {
      email: "",
      password: "",
      terms: true, // pre-checked
    },
  });

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  // Optional: watch terms value if needed elsewhere
  const termsValue = watch("terms");

  // src/hooks/useLoginForm.ts

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginVendor({
        email: data.email,
        password: data.password,
        terms: false
      }).unwrap();

      if (res.success) {
        toast.success("Login successful! Redirecting...", {
          position: "top-center",
          duration: 3000,
        });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 800);
      }
    } catch (err: any) {
      console.log("Login error:", err);

      const message = err?.data?.message || "Login failed. Please try again.";

      // Detect unverified email case
      if (err?.status === 403 && message.toLowerCase().includes("verify your email")) {
        toast.error("Please verify your email to continue.", {
          duration: 6000,
        });

        // Redirect to OTP verification page with encoded email
        const encodedEmail = encodeURIComponent(data.email.trim().toLowerCase());
        window.location.href = `/verify/${encodeURIComponent(encodedEmail)}`;
        return;
      }

      // All other errors
      toast.error(message, {
        position: "top-center",
        duration: 5000,
      });
    }
  };

  // Helper to safely update terms + trigger validation
  const handleTermsChange = (checked: boolean) => {
    setValue("terms", checked, { shouldValidate: true });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    isError,
    error: error as any,
    showPassword,
    togglePasswordVisibility,
    setValue,           // Now available!
    trigger,            // For manual validation
    terms: termsValue,  // Current value of checkbox
    handleTermsChange,  // Recommended way to handle checkbox
  };
};