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
    console.log("User Role:", userRole)
    const userEmail = user?.email;
    const isVerified = user?.isVerified;



    console.log("Auth Debug:", {
      userRole,
      requiredRole,
      hasEmail: !!userEmail,
      isVerified,
    
      currentPath: location.pathname
    });

    // ✅ Not logged in
    if (!userEmail) {
      return <Navigate to="/loginvendor" replace />;
    }

    // ✅ NOT VERIFIED → BLOCK DASHBOARD
    if (!isVerified) {
      toast.error("Please verify your email first!");
      return <Navigate to="/" replace />;
    }

    // ✅ Role mismatch
    if (requiredRole && requiredRole !== userRole) {
      console.log("requiredRole", requiredRole);
      return <Navigate to="/unauthorized" replace />;
    }

    // // Supplier assignment rule
    // if (requiredRole === "SUPPLIER") {
    //   // If supplier has no submission at all → force to assignment
    //   if (!hasSubmission) {
    //     if (location.pathname !== "/assignment") {
    //       return <Navigate to="/assignment" replace />;
    //     }
    //   }

    

    //   // If submission is SUBMITTED
    //   if (isSubmitted) {
    //     // If user tries to access assignment page, redirect to analytics
    //     if (location.pathname === "/assignment") {
    //       toast.error("Assessment already submitted!");
    //       return <Navigate to="/supplier/analytics" replace />;
    //     }

    //     // Allow access to all other supplier pages
    //     return <Component />;
    //   }

    //   // For DRAFT status, allow access to assignment page only
    //   if (isDraft && location.pathname === "/assignment") {
    //     return <Component />;
    //   }

    //   // Default: if user has any submission (even draft) and tries to access analytics,
    //   // but draft should block analytics access
    //   if (hasSubmission && location.pathname === "/supplier/analytics" && isDraft) {
    //     //toast.error("Please complete your draft assessment first!");
    //     return <Navigate to="/assignment" replace />;
    //   }

    //   // For new users with no submission, only allow assignment page
    //   if (!hasSubmission && location.pathname !== "/assignment") {
    //     return <Navigate to="/assignment" replace />;
    //   }
    // }

    // ✅ SUCCESS
    return <Component />;
  };
};