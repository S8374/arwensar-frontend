// components/ForgotPassword.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import forgetPass from "../../../assets/Auth/forgetPass.png";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { NavLink } from "react-router-dom";
import GoBackAndHomeButtons from "@/hooks/GoBackButton";
import { RouteLoadingIndicator } from "@/hooks/page-transition";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isSuccess,
    isError,
    otp,
  } = useForgotPassword();

  return (
    <section className="min-h-screen bg-primary/10 flex items-center justify-center py-12 px-6">
        <RouteLoadingIndicator/>
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-items-center">
          {/* Left: Form */}
          <div className="w-full max-w-md flex flex-col items-center lg:items-start space-y-12">
            {/* Header */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Forgot Password
              </h1>
              <p className="text-lg text-muted-foreground">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
              <GoBackAndHomeButtons/>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="w-full p-4 bg-background  border rounded-xl">
                <p className="text-chart-2 text-sm">
                  Password reset OTP has been sent to your email!
                  <br />
                  <span className="font-mono bg-background px-2 py-1 rounded text-chart-2">
                    OTP: {otp}
                  </span>
                </p>
              </div>
            )}

            {/* Error Message */}
            {isError && (
              <div className="w-full p-4 bg-background border 0 runded-xl">
                <p className="text-chart-1 text-sm">
                  Failed to send reset email. Please try again.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="eva@gmail.com"
                  className="h-14 rounded-xl text-base"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/10 text-foreground rounded-xl shadow-lg disabled:opacity-50"
              >
                {isLoading ? "Sending OTP..." : "Submit"}
              </Button>
            </form>

            {/* Back to Login */}
            <p className="text-center text-sm text-muted-foreground w-full">
              Remember your password?{" "}
              <NavLink to={"/loginvendor"} className="text-primary font-medium hover:underline">
                Back to Login
              </NavLink>
            </p>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <img
              src={forgetPass}
              alt="Forgot password illustration"
              className="max-w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}