/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import { useEffect, type ComponentType } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading, isError, refetch } = useUserInfoQuery(undefined);
    const location = useLocation();
    useEffect(() => {
      refetch();
    }, [location.pathname]);
    // ✅ Loading
    if (isLoading) {
      return (
        <div className="w-full h-screen flex items-center justify-center text-lg font-medium">
          Loading...
        </div>
      );
    }

    // ✅ API error → force login
    if (isError) {
      return <Navigate to="/loginvendor" replace />;
    }

    const user = data?.data;
    const userRole = user?.role;
    const userEmail = user?.email;
    const isVerified = user?.isVerified;
    // ✅ Not logged in
    if (!userEmail) {
      return <Navigate to="/loginvendor" replace />;
    }
   console.log("withAuth Debug:", {
      userRole,
      requiredRole,
      isVerified,
   },);
    // ✅ NOT VERIFIED → BLOCK DASHBOARD
    if (!isVerified) {
      toast.error("Please verify your email first!");
      return <Navigate to="/" replace />;
    }

    // ✅ Role mismatch
    if (requiredRole && requiredRole !== userRole) {
      return <Navigate to="/unauthorized" replace />;
    }
    // ✅ SUCCESS
    return <Component />;
  };
};

