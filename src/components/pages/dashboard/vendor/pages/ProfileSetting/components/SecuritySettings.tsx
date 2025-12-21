// src/components/pages/dashboard/vendor/pages/SecuritySettings.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";

export default function SecuritySettings() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isSuccess,
    isError,
    showNewPass,
    showConfirmPass,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useUpdatePassword();

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Lock className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-foreground">Security Settings</h2>
      </div>

      {/* Success/Error Messages */}
      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 text-sm font-medium">
              Password updated successfully!
            </p>
          </div>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 text-sm">
              Failed to update password. Please check your current password and try again.
            </p>
          </div>
        </div>
      )}

      {/* Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-sm font-medium">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            className="h-12 bg-muted/40 border-0 focus-visible:ring-1 placeholder:text-muted-foreground/50"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium">
            New Password
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPass ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 bg-muted/40 border-0 focus-visible:ring-1 placeholder:text-muted-foreground/50 pr-12"
              {...register("newPassword")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-12 w-12"
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPass ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Password must be at least 8 characters long
          </p>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPass ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 bg-muted/40 border-0 focus-visible:ring-1 placeholder:text-muted-foreground/50 pr-12"
              {...register("confirmPassword")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-12 w-12"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPass ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Update Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-chart-6 hover:bg-chart-6/90 font-medium px-6 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}