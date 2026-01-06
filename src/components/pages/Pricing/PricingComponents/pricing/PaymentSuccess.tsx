import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Optional: for a spinner (or use your own)
import { useGetSessionStatusQuery } from "@/redux/features/payment/payment.api";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const {
    data: sessionStatus,
    isLoading,
    isError,
  } = useGetSessionStatusQuery(sessionId ?? "", {
    skip: !sessionId, // Skip query if no session_id
    pollingInterval: 3000, // Optional: poll every 3s if needed for async methods
  });

  useEffect(() => {
    if (!sessionId) {
      // No session_id — likely accessed directly or invalid
      navigate("/pricing", { replace: true });
    }
  }, [sessionId, navigate]);

  if (!sessionId) {
    return null; // Redirecting...
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl">Verifying your payment...</p>
      </div>
    );
  }

  if (isError || !sessionStatus?.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Verification Failed
        </h1>
        <p>Something went wrong. Please contact support.</p>
        {/* Optionally display error.message if available */}
      </div>
    );
  }

  const { status, paymentStatus } = sessionStatus.data;

  if (status === "complete" && paymentStatus === "paid") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-green-600 mb-6">
          Payment Successful! 🎉
        </h1>
        <p className="text-xl mb-8">
          Thank you for your subscription. Your account is now active.
        </p>
        <button
          onClick={() => navigate("/vendor/analytics")} // Redirect to your app's main page
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Fallback: open/expired or unpaid
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">
        Payment Incomplete
      </h1>
      <p>
        Status: {status} | Payment: {paymentStatus}
      </p>
      <button
        onClick={() => navigate("/pricing")}
        className="mt-6 px-6 py-3 bg-gray-600 text-white rounded-lg"
      >
        Back to Pricing
      </button>
    </div>
  );
};

export default PaymentSuccess;