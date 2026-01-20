/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// src/components/pages/auth/verifyOtp/VerifyOTP.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useVerifyEmailMutation,
  useResendOTPMutation,
} from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

export default function VerifyOTP() {
  const { email: encodedEmail } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const decodedEmail = encodedEmail ? decodeURIComponent(encodedEmail) : "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0); // 0 = no OTP sent yet or expired
  const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  // Redirect if no email
  useEffect(() => {
    if (!decodedEmail) {
      toast.error("Invalid link. Please try registering again.");
      navigate("/signinvendor");
    }
  }, [decodedEmail, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setOtpSent(false); // Allow resend when timer ends
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only last digit
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = pasted.split("").concat(["", "", "", "", "", ""]).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = pasted.length - 1;
    if (lastIndex < 6) {
      document.getElementById(`otp-${lastIndex}`)?.focus();
    }
  };

  const handleSendOTP = async () => {
    if (!decodedEmail) return;

    try {
      const result = await resendOTP({ email: decodedEmail }).unwrap();

      if (result.success) {
        toast.success("Verification code sent to your email!");
        setOtpSent(true);
        setTimeLeft(60); // Start 60-second timer
        setOtp(["", "", "", "", "", ""]); // Clear previous OTP
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send OTP. Try again.");
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    try {
      const result = await verifyEmail({
        email: decodedEmail,
        otp: otpString,
      }).unwrap();

      if (result.success) {
        toast.success("Email verified successfully!");

        // Smart redirect: if came from login → go to dashboard, else login page
        const fromLogin = location.state?.fromLogin;
        navigate(fromLogin ? "/" : "/loginvendor", {
          state: fromLogin
            ? null
            : { message: "Email verified! Please log in.", email: decodedEmail },
        });
      }
    } catch (error: any) {
      if (error?.data?.errors) {
        error.data.errors.forEach((err: any) => toast.error(err.message));
      } else {
        toast.error(error?.data?.message || "Invalid or expired code");
      }
    }
  };

  if (!decodedEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold">Invalid Link</h1>
          <p className="text-muted-foreground">
            The verification link is invalid or expired.
          </p>
          <Button onClick={() => navigate("/signinvendor")} className="w-full">
            Go to Registration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to
            <br />
            <span className="font-semibold text-primary">{decodedEmail}</span>
          </p>

          {/* Optional: Show message if redirected from login */}
          {location.state?.fromLogin && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>One more step!</strong> Please verify your email to access your account.
              </p>
            </div>
          )}
        </div>

        {/* Initial State: Send OTP Button */}
        {!otpSent && timeLeft === 0 && (
          <div className="space-y-6">
            <Button
              onClick={handleSendOTP}
              disabled={isResending}
              className="w-full h-12 text-lg"
            >
              {isResending ? "Sending Code..." : "Send Verification Code"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Not your email?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => navigate("/signinvendor")}
              >
                Register with a different email
              </Button>
            </p>
          </div>
        )}

        {/* OTP Input Form - Only shown after OTP sent */}
        {(otpSent || timeLeft > 0) && (
          <>
            <div className="space-y-4">
              <Label className="text-base">Enter Verification Code</Label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="h-16 w-16 text-center text-2xl font-bold"
                    autoFocus={index === 0 && otp[0] === ""}
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Code expires in:{" "}
                  <span
                    className={`font-semibold ${
                      timeLeft < 20 ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleVerify}
                disabled={isVerifying || otp.join("").length !== 6}
                className="w-full h-12 text-lg"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleSendOTP}
                  disabled={isResending || timeLeft > 0}
                  className="text-primary"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Check your spam folder if you don't see the email.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}