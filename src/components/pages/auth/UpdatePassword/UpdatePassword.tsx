import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import updatePassImage from "../../../../assets/Auth/forgetPass.png";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";
import { RouteLoadingIndicator } from "@/hooks/page-transition";

export default function UpdatePassword() {
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
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-6 py-12">
        <RouteLoadingIndicator/>
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-items-center">

          {/* Left: Form – Perfectly Centered */}
          <div className="w-full max-w-md flex flex-col items-center lg:items-start space-y-10">

            {/* Header */}
            <div className="text-center lg:text-left space-y-5">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Update your password
              </h1>
              <p className="text-lg text-muted-foreground">
                Create a new strong password for your account security.
              </p>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  Password updated successfully!
                </p>
              </div>
            )}

            {/* Error Message */}
            {isError && (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  Failed to update password. Please try again.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              {/* New Password */}
              <div className="space-y-3">
                <Label htmlFor="newPassword" className="text-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-14 rounded-xl pr-12 text-base"
                    {...register("newPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {showNewPass ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-14 rounded-xl pr-12 text-base"
                    {...register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPass ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Password Requirements:
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• One uppercase letter (A-Z)</li>
                  <li>• One lowercase letter (a-z)</li>
                  <li>• One number (0-9)</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl shadow-lg disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <a href="/login" className="text-primary font-medium hover:underline">
                  Back to Login
                </a>
              </p>
            </form>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <img
              src={updatePassImage}
              alt="Team updating password"
              className="max-w-lg drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}