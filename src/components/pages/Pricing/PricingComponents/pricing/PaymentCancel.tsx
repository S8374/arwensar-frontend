import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-6">
        Payment Cancelled
      </h1>
      <p className="text-xl mb-8">
        You cancelled the payment process. No charges were made.
      </p>
      <button
        onClick={() => navigate("/pricing")} // Or wherever your plans are
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentCancel;