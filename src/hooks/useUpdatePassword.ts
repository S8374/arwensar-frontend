// src/hooks/useUpdatePassword.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "@/redux/features/auth/auth.api";
import { updatePasswordSchema, type UpdatePasswordData } from "@/validation/update-password";

export const useUpdatePassword = () => {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [updatePassword, { isLoading, isSuccess, isError }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const toggleNewPasswordVisibility = () => setShowNewPass(!showNewPass);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPass(!showConfirmPass);

  const onSubmit = async (data: UpdatePasswordData) => {
    try {
      console.log("Update password data submitted:", data);
      
      // Call the API with the correct field names
      await updatePassword({
        oldPassword: data.currentPassword as string, // Map currentPassword to oldPassword
        newPassword: data.newPassword,
      }).unwrap();
      
      console.log("Password updated successfully!");
      
      // Reset form on success
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Reset visibility states
      setShowNewPass(false);
      setShowConfirmPass(false);
      
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    isError,
    showNewPass,
    showConfirmPass,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    watch,
  };
};