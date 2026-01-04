/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useUpdatePasswordMutation } from "@/redux/features/user/user.api";

// Zod schema matching backend expectations
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SecuritySettings() {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleNewPasswordVisibility = () => setShowNewPass(!showNewPass);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPass(!showConfirmPass);

  const onSubmit = async (data: PasswordFormData) => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage("");

    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      setIsSuccess(true);
      reset(); // Clear form after success
    } catch (err: any) {
      console.error("Password update failed:", err);

      let message = "Failed to update password. Please try again.";

      if (err?.data?.message?.includes("Current password is incorrect")) {
        setError("currentPassword", {
          type: "manual",
          message: "Current password is incorrect",
        });
        message = "Current password is incorrect";
      } else if (err?.data?.message) {
        message = err.data.message;
      }

      setIsError(true);
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="w-full  mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Lock className="w-6 h-6 text-chart-6" />
        <h2 className="text-2xl font-bold text-foreground">Security Settings</h2>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">
            Password updated successfully! An email confirmation has been sent.
          </p>
        </div>
      )}

      {/* Error Message */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">
            {errorMessage || "Failed to update password. Please try again."}
          </p>
        </div>
      )}

      {/* Password Change Form */}
      <div className="bg-card border rounded-xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Change Password</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              className="h-12 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-chart-6"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPass ? "text" : "password"}
                placeholder="Enter new password"
                className="h-12 pr-12 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-chart-6"
                {...register("newPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-12 w-12 text-muted-foreground hover:bg-transparent"
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm new password"
                className="h-12 pr-12 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-chart-6"
                {...register("confirmPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-12 w-12 text-muted-foreground hover:bg-transparent"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !isDirty}
              className="bg-chart-6 hover:bg-chart-6/90 font-medium px-8 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}