import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import {
  updatePasswordSchema,
  type UpdatePasswordData,
} from "@/validation/update-password";
import { toast } from "sonner";

export const useUpdatePassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [resetPassword, { isLoading, isSuccess }] =
    useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  // 🔒 Redirect if token missing
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired reset link");
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);

  const onSubmit = async (data: UpdatePasswordData) => {
    console.log("✅ SUBMIT DATA", data);

    try {
      await resetPassword({
        token: token!,
        password: data.newPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      reset();

      setTimeout(() => {
        navigate("/loginvendor", { replace: true });
      }, 2000);
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Reset link expired or invalid"
      );
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    showNewPass,
    showConfirmPass,
    toggleNewPasswordVisibility: () =>
      setShowNewPass((p) => !p),
    toggleConfirmPasswordVisibility: () =>
      setShowConfirmPass((p) => !p),
    hasValidToken: !!token,
  };
};
