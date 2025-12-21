import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { otpFormSchema, type OTPFormData } from "@/validation/otp";
import { useSendOTPMutation, useVerifyOTPMutation } from "@/redux/features/auth/auth.api";

export const useOTPForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  
  const [_verifyOTP, { 
    isLoading: isVerifying, 
    isSuccess: isVerified, 
    isError: isVerificationError,
    error: verificationError 
  }] = useVerifyOTPMutation();
  
  const [_resendOTP, { 
    isLoading: isResending, 
    isSuccess: isResent,
    isError: isResendError 
  }] = useSendOTPMutation();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Update form value when OTP changes
  useEffect(() => {
    const otpString = otp.join('');
    setValue("otp", otpString);
    if (otpString.length === 6) {
      trigger("otp");
    }
  }, [otp, setValue, trigger]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split('').forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      document.getElementById(`otp-${focusIndex}`)?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    try {
      // await resendOTP(data).unwrap();
      console.log("OTP resent successfully");
      
      // Start countdown timer (60 seconds)
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Clear current OTP
      setOtp(["", "", "", "", "", ""]);
      document.getElementById(`otp-0`)?.focus();
    } catch (error) {
      console.error("Failed to resend OTP");
    }
  };

  const onSubmit = async (data: OTPFormData) => {
    try {
      console.log("OTP submitted:", data.otp);
   
    } catch (error) {
      console.error("OTP verification failed:", error);
      // Clear OTP on failure
      setOtp(["", "", "", "", "", ""]);
      document.getElementById(`otp-0`)?.focus();
    }
  };

  return {
    otp,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit: handleSubmit(onSubmit),
    handleResendOTP,
    errors,
    isSubmitting: isVerifying,
    isResending,
    resendTimer,
    isVerified,
    isVerificationError,
    verificationError,
    isResent,
    isResendError,
  };
};