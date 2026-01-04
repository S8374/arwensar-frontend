/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
// src/components/pages/auth/VerifyEmail.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, AlertCircle, } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RouteLoadingIndicator } from "@/hooks/page-transition";
import { useVerifyEmailMutation } from "@/redux/features/auth/auth.api";

// Define error response type
interface ApiError {
  data?: {
    message?: string;
    error?: string;
  };
  status?: number;
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const location = useLocation();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'already' | 'expired'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [redirectTimer, setRedirectTimer] = useState<number>(5);
  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setVerificationStatus('error');
      setErrorMessage("No verification token found in URL");
    }
  }, [token]);

useEffect(() => {
  if (verificationStatus === 'success' || verificationStatus === 'already') {
    const timer = setInterval(() => {
      setRedirectTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(location, { replace: true }); // redirect to original location
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }
}, [verificationStatus, navigate, location]);

  const handleVerification = async () => {
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage("No verification token provided");
      return;
    }

    try {
      const result = await verifyEmail(token).unwrap();

      if (result.success) {
        if (result.data?.isAlreadyVerified) {
          setVerificationStatus('already');
        } else {
          setVerificationStatus('success');
        }
      }
    } catch (err: any) {
      console.error("Verification failed:", err);

      const apiError = err as ApiError;

      if (apiError?.status === 400) {
        const message = apiError.data?.message || "Invalid verification token";
        setErrorMessage(message);

        if (message.includes("expired") || message.includes("expire")) {
          setVerificationStatus('expired');
        } else {
          setVerificationStatus('error');
        }
      } else if (apiError?.status === 404) {
        setVerificationStatus('error');
        setErrorMessage("User not found");
      } else {
        setVerificationStatus('error');
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'pending':
        return (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <CardTitle className="text-center">Verifying your email...</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your email address.
            </CardDescription>
          </>
        );

      case 'success':
        return (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-center">Email Verified Successfully!</CardTitle>
            <CardDescription className="text-center">
              Your email has been verified. Redirecting to home page in {redirectTimer} seconds...
            </CardDescription>
          </>
        );

      case 'already':
        return (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-center">Already Verified</CardTitle>
            <CardDescription className="text-center">
              Your email is already verified. Redirecting to home page in {redirectTimer} seconds...
            </CardDescription>
          </>
        );

      case 'expired':
        return (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <XCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-center">Verification Link Expired</CardTitle>
            <CardDescription className="text-center">
              {errorMessage || "This verification link has expired. Please request a new one."}
            </CardDescription>
          </>
        );

      case 'error':
        return (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-center">Verification Failed</CardTitle>
            <CardDescription className="text-center">
              {errorMessage || "Invalid verification link. Please request a new one."}
            </CardDescription>
          </>
        );
    }
  };

  const handleRetry = () => {
    if (token) {
      setVerificationStatus('pending');
      setErrorMessage("");
      handleVerification();
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RouteLoadingIndicator />
      <Card className="w-full max-w-md">
        <CardHeader>
          {renderContent()}
        </CardHeader>

        <CardContent className="space-y-4">
          {verificationStatus === 'success' || verificationStatus === 'already' ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  You can now log in and access all features of the platform.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => navigate("/", { replace: true })}
                className="w-full"
              >
                Go to Home Now
              </Button>
            </div>
          ) : verificationStatus === 'expired' ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  Verification links expire after 1 hour for security reasons.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">

                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          ) : verificationStatus === 'error' ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {errorMessage || "There was an error verifying your email."}
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                {token && (
                  <Button
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Try Again
                  </Button>
                )}

                <Button
                  onClick={() => navigate("/")}
                  variant="ghost"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>

        {verificationStatus === 'error' || verificationStatus === 'expired' ? (
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-500 text-center">
              Need help? Contact support at support@example.com
            </p>
            <p className="text-xs text-gray-400">
              Error details: {errorMessage}
            </p>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}