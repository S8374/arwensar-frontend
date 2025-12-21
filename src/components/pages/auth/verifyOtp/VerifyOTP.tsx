// src/components/pages/auth/verifyOtp/VerifyOTP.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate } from "react-router-dom";
import { useVerifyEmailMutation, useResendOTPMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

export default function VerifyOTP() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  
  const decodedEmail = email ? decodeURIComponent(email) : "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds as requested
  
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  // Check if email exists on mount
  useEffect(() => {
    if (!decodedEmail) {
      toast.error("Email not found. Please register again.");
      navigate("/signinvendor");
    }
  }, [decodedEmail, navigate]);

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) return;
    
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
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    if (!decodedEmail) {
      toast.error("Email not found");
      navigate("/signinvendor");
      return;
    }

    try {
      // IMPORTANT: Send as object with email and otp properties
      const result = await verifyEmail({
        email: decodedEmail,
        otp: otpString,
      }).unwrap();
      
      console.log("Verification response:", result);
      
      if (result.success) {
        toast.success(result.message || "Email verified successfully!");
        
        localStorage.removeItem("pendingVerificationEmail");
        
        navigate("/loginvendor", {
          state: { 
            message: "Email verified successfully! Please login to continue.",
            email: decodedEmail
          }
        });
      } else {
        toast.error(result.message || "Failed to verify email");
      }
    } catch (error: any) {
      console.error("Verification error details:", error);
      
      if (error?.data?.errors) {
        // Show validation errors
        error.data.errors.forEach((err: any) => {
          toast.error(`${err.path}: ${err.message}`);
        });
      } else {
        toast.error(error?.data?.message || "Failed to verify email");
      }
    }
  };

  const handleResendOTP = async () => {
    if (!decodedEmail) {
      toast.error("Email not found");
      return;
    }

    try {
      // IMPORTANT: Send as object with email property
      const result = await resendOTP({ email: decodedEmail }).unwrap();
      
      console.log("Resend OTP response:", result);
      
      if (result.success) {
        setTimeLeft(60); // Reset to 60 seconds
        setOtp(["", "", "", "", "", ""]);
        toast.success(result.message || "New OTP sent to your email");
      } else {
        toast.error(result.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  if (!decodedEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Email Not Found</h1>
            <p className="text-muted-foreground">
              Please register again to receive a verification email.
            </p>
            <Button onClick={() => navigate("/signinvendor")} className="mt-4">
              Go to Registration
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold text-primary">{decodedEmail}</span>
          </p>
        </div>

        <div className="space-y-4">
          <Label>Enter OTP</Label>
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
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Code expires in:{" "}
              <span className={`font-semibold ${timeLeft < 30 ? "text-destructive" : "text-primary"}`}>
                {formatTime(timeLeft)}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleVerify}
            disabled={isVerifying || otp.join("").length !== 6}
            className="w-full h-12"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={handleResendOTP}
              disabled={isResending || timeLeft > 30} // Can resend after 30 seconds
              className="text-primary"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Didn't receive the email? Check your spam folder or{" "}
              <Button
                variant="link"
                onClick={() => navigate("/signinvendor")}
                className="p-0 h-auto text-primary"
              >
                try a different email
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}