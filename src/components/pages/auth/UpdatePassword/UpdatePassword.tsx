import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";

export default function UpdatePassword() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isSuccess,
    showNewPass,
    showConfirmPass,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
    hasValidToken,
  } = useUpdatePassword();

  if (!hasValidToken) return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">

        <h1 className="text-3xl font-bold">Set New Password</h1>

        {isSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Password updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ✅ Accessibility username field */}
          <input
            type="email"
            name="email"
            autoComplete="username"
            hidden
          />

          {/* New Password */}
          <div>
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showNewPass ? "text" : "password"}
                autoComplete="new-password"
                {...register("newPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPass ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPass ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPass ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </section>
  );
}
