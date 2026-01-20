/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const message =
    err?.data?.message ||
    err?.error ||
    err?.message ||
    "Login failed";

  // 🔐 Wrong email or password
  if (err?.status === 401) {
    toast.error("Incorrect  password", {
      position: "top-center",
      duration: 4000,
    });
    return;
  }

  // 📧 Email not verified
  if (
    err?.status === 403 &&
    message.toLowerCase().includes("verify")
  ) {
    toast.error("Please verify your email to continue.", {
      duration: 6000,
    });

    const encodedEmail = encodeURIComponent(data.email.trim().toLowerCase());
    window.location.href = `/verify/${encodedEmail}`;
    return;
  }

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