// components/ForgotPassword.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import forgetPass from "../../../assets/Auth/forgetPass.png";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { NavLink } from "react-router-dom";
import GoBackAndHomeButtons from "@/hooks/GoBackButton";
import { RouteLoadingIndicator } from "@/hooks/page-transition";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isSuccess,
    isError,
  } = useForgotPassword();

  return (
    <section className="min-h-screen bg-primary/10 flex items-center justify-center py-12 px-6">
      <RouteLoadingIndicator />
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-items-center">

          {/* Left: Form */}
          <div className="w-full max-w-md flex flex-col items-center lg:items-start space-y-12">
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Forgot Password?
              </h1>
              <p className="text-lg text-muted-foreground">
                Enter your email and we'll send you a link to reset your password.
              </p>
              <GoBackAndHomeButtons />
            </div>

            {/* Success Message */}
            {isSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Password reset link sent! Please check your email.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to send reset link. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="eva@example.com"
                  className="h-14 rounded-xl"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-medium"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground w-full">
              Remember your password?{" "}
              <NavLink to="/loginvendor" className="text-primary font-medium hover:underline">
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