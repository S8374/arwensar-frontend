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

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
// import { useGetAssessmentsQuery, useGetAssessmentUserByIdQuery } from "@/redux/features/assainment/assainment.api";
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import type { TRole } from "@/types";
// import { useEffect, type ComponentType } from "react";
// import toast from "react-hot-toast";
// import { Navigate, useLocation } from "react-router-dom";

// export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
//   return function AuthWrapper() {
//     const location = useLocation();

//     const { data: userData, isLoading, isError, refetch } = useUserInfoQuery(undefined);

//     // Move supplier-specific hooks here, unconditionally
//     // Skip them if not needed (e.g., wrong role or no userId)
//     const shouldSkipSupplierQueries = requiredRole !== "SUPPLIER" || !userData?.data?.id;

//     const {
//       data: assessmentData,
//       isLoading: assessmentLoading,
//     } = useGetAssessmentUserByIdQuery(userData?.data?.id!, {
//       skip: shouldSkipSupplierQueries || !userData?.data?.id,
//     });

//     const {
//       data: allAssainment,
//       isLoading: assessmentsLoading,
//     } = useGetAssessmentsQuery(undefined, {
//       skip: shouldSkipSupplierQueries,
//     });

//     useEffect(() => {
//       refetch();
//     }, [location.pathname]);

//     // Loading
//     if (isLoading) {
//       return (
//         <div className="w-full h-screen flex items-center justify-center text-lg font-medium">
//           Loading...
//         </div>
//       );
//     }

//     // API error → force login
//     if (isError) {
//       return <Navigate to="/loginvendor" replace />;
//     }

//     const user = userData?.data;
//     const userRole = user?.role;
//     const userEmail = user?.email;
//     const isVerified = user?.isVerified;

//     // Not logged in
//     if (!userEmail) {
//       return <Navigate to="/loginvendor" replace />;
//     }

//     // NOT VERIFIED → BLOCK DASHBOARD
//     if (!isVerified) {
//       toast.error("Please verify your email first!");
//       return <Navigate to="/" replace />;
//     }

//     // Role mismatch
//     if (requiredRole && requiredRole !== userRole) {
//       console.log("requiredRole", requiredRole);
//       return <Navigate to="/unauthorized" replace />;
//     }

//     // Only continue with supplier-specific logic if role matches
//     if (requiredRole === "SUPPLIER") {
//       // Show loading if any assessment query is loading (and not skipped)
//       if ((assessmentsLoading || assessmentLoading) && !shouldSkipSupplierQueries) {
//         return (
//           <div className="w-full h-screen flex items-center justify-center text-lg font-medium">
//             Loading assessments...
//           </div>
//         );
//       }

//       // Check if user has any assessment submission
//       const userSubmission = assessmentData?.data;
//       const hasSubmission = userSubmission && userSubmission.length > 0;
//       // Check the status of the FIRST submission (assuming one active at a time)
//       const firstSubmissionStatus = hasSubmission ? userSubmission[0]?.status : null;
//       const isSubmitted = hasSubmission && userSubmission[0]?.status === "PENDING";
//       const firstAssessment = allAssainment?.data?.[0];
//       const firstAssessmentId = firstAssessment?.id;
//       const hasAssessmentsInDB = allAssainment?.data && allAssainment.data.length > 0;

//       console.log("Supplier Debug:", {
//         userRole,
//         requiredRole,
//         hasSubmission,
//         isSubmitted,
//         firstAssessmentId,
//         hasAssessmentsInDB,
//         assessmentData: userSubmission,
//         currentPath: location.pathname
//       });

//       // If assessment is SUBMITTED (PENDING status)
//       if (firstSubmissionStatus === "PENDING") {
//         // Already submitted → block initial assessment pages
//         if (location.pathname.startsWith("/initial-assessment/") || location.pathname === "/assignment") {
//           toast.error("Assessment already submitted!");
//           return <Navigate to="/supplier/analytics" replace />;
//         }
//         return <Component />;
//       }
//       // If DRAFT or NO submission → user must complete the assessment
//       if (!hasAssessmentsInDB) {
//         // No assessments available in system
//         if (location.pathname.startsWith("/initial-assessment/")) {
//           toast.error("No assessments available at the moment.");
//           return <Navigate to="/supplier/analytics" replace />;
//         }
//         return <Component />;
//       }
//       // If user has NO submission at all
//       if (!hasSubmission) {
//         const isOnInitialAssessmentPage = location.pathname.startsWith("/initial-assessment/");

//         if (hasAssessmentsInDB) {
//           if (!isOnInitialAssessmentPage && firstAssessmentId) {
//             return <Navigate to={`/initial-assessment/${firstAssessmentId}`} replace />;
//           }
//           if (isOnInitialAssessmentPage) {
//             return <Component />;
//           }
//         } else {
//           if (location.pathname.startsWith("/initial-assessment/")) {
//             toast.error("No assessments available at the moment.");
//             return <Navigate to="/supplier/analytics" replace />;
//           }
//           return <Component />;
//         }
//       }
//       // There ARE assessments in DB
//       const isOnInitialAssessmentPage = location.pathname.startsWith("/initial-assessment/");
//       const targetPath = `/initial-assessment/${firstAssessmentId}`;

//       if (!isOnInitialAssessmentPage && firstAssessmentId) {
//         // Not on the assessment page → redirect to it
//         // This covers both: no submission AND draft status
//         if (firstSubmissionStatus === "DRAFT") {
//           toast.error("Please complete your in-progress assessment.");
//         } else {
//           toast.error("Please complete the initial assessment.");
//         }
//         return <Navigate to={targetPath} replace />;
//       }
//       // Default for supplier
//       return <Component />;
//     }

//     // SUCCESS for non-supplier roles
//     return <Component />;
//   };
// };

