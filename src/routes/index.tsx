import App from "@/App";
import AboutUs from "@/components/pages/Aboutus/Aboutus";
import ContactForm from "@/components/pages/contact/ContactFrom";
import Demo from "@/components/pages/Demo/Demo";
import Homepage from "@/components/pages/Home/HomePages";
import Price from "@/components/pages/Pricing/Pricing";
import Services from "@/components/pages/services/Services";
import SignInVendor from "@/components/pages/auth/SignInVendor/SigninVendor";
import { createBrowserRouter } from "react-router-dom"; // ✅ Use react-router-dom
import VerifyOTP from "@/components/pages/auth/verifyOtp/VerifyOTP";
import LoginVendor from "@/components/pages/auth/LoginVendor/LoginVendor";
import ForgotPassword from "@/components/modules/Authentication/ForgotPassword";
import UpdatePassword from "@/components/pages/auth/UpdatePassword/UpdatePassword";
import { Navigate } from "react-router-dom"; // ✅ Use react-router-dom
import DashboardLayout from "@/components/layout/DashboardLayout";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import { vendorSidebarItems } from "./VendorSidebarItems";
import { withAuth } from "@/lib/withAuth";
import { generateRoutes } from "@/lib/generateRoutes";
import SupplierDetailPage from "@/components/pages/dashboard/vendor/pages/SupplierManagement/SupplierDetailPage";
import SupplyerAssainmentDetails from "@/components/pages/dashboard/vendor/pages/SupplierManagement/component/SupplyerAssainmentDetails";
import Unauthorized from "@/components/Unauthorized";
import { suppliersSidebarItems } from "./SupplierSidebarItems";
import DataSecurityAssessment from "@/components/pages/dashboard/supplier/components/DataSecurityAssessment";
import AssessmentReview from "@/components/pages/dashboard/supplier/components/overviewComponent/AssessmentReview";
import SignInSupplyer from "@/components/pages/auth/SignInSupplyer/SignInVendor";
import SupplierAssignmentForm from "@/components/pages/dashboard/supplier/components/QuickSecurityAssessment";
import ProblemsList from "@/components/pages/dashboard/problem/ProblemList";
import ProblemDetail from "@/components/pages/dashboard/problem/ProblemDetails";
import PaymentSuccess from "@/components/pages/Pricing/PricingComponents/pricing/PaymentSuccess";
import PaymentCancel from "@/components/pages/Pricing/PricingComponents/pricing/PaymentCancel";
import QuickSecurityAssessment from "@/components/pages/dashboard/supplier/components/QuickSecurityAssessment";
import PrivacyPolicy from "@/components/pages/PrivacyPolicy/PrivacyPolicy";

export const router = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            {
                Component: Homepage,
                index: true,
            },
            {
                Component: Services,
                path: "services"
            },
            {
                Component: AboutUs,
                path: "aboutus"
            },
            {
                Component: Price,
                path: "pricing"
            },
            {
                Component: Demo,
                path: "demo"
            },
            {
                Component: ContactForm,
                path: "contact"
            }
        ]
    },
    {
        Component: withAuth(DashboardLayout, role.vendor as TRole),
        path: "/vendor",
        children: [
            {
                index: true,
                element: <Navigate to="/vendor/analytics" replace />
            },
            ...generateRoutes(vendorSidebarItems),
            {
                path: "/vendor/suppliers/:id",
                Component: SupplierDetailPage,
            },
            {
                path: "/vendor/assainment/:supplierId/:assainmentId",
                Component: SupplyerAssainmentDetails,
            }
        ],
    },
    {
        Component: withAuth(DashboardLayout, role.suplier as TRole),
        path: "/supplier",
        children: [
            {
                index: true,
                element: <Navigate to="/supplier/analytics" replace />
            },
            ...generateRoutes(suppliersSidebarItems),
            {
                path: "/supplier/assessments/:assessmentId",
                Component: DataSecurityAssessment
            },
            {
                path: "/supplier/assessments/data-security/review",
                Component: AssessmentReview,
            },
            {
                path: "/supplier/assessments/data-security/review",
                Component: AssessmentReview,
            },
            {
                path: "/supplier/assessments/data-security/review",
                Component: AssessmentReview,
            },
            {
                path: "/supplier/problems",
                Component: ProblemsList,
            },

        ]
    },
    {
        path: "/problems/:problemId",
        Component: ProblemDetail,
    },
    {
        path: "/privacy-policy",
        Component: PrivacyPolicy,
    }
    ,
    {
        path: "/initial-assessment/:assessmentId",
        Component: QuickSecurityAssessment
    },
    {
        Component: SupplierAssignmentForm,
        path: "assignment"
    },
    {
        Component: SignInVendor,
        path: "signinvendor"
    },
    {
        Component: SignInSupplyer,
        path: "supplier/register"
    },
    {
        Component: LoginVendor,
        path: "loginvendor"
    },
    {
        Component: VerifyOTP,
        path: "verify/:email"
    },
    {
        Component: ForgotPassword,
        path: "forgot-password"
    },
    {
        Component: UpdatePassword,
        path: "reset-password"
    }
    ,
    {
        Component: Unauthorized,
        path: "unauthorized"
    },
    // Add this to your router configuration
    {
        path: "/payment/success",
        element: <PaymentSuccess />,
    },
    {
        path: "/payment/cancel",
        element: <PaymentCancel />,
    },

]);