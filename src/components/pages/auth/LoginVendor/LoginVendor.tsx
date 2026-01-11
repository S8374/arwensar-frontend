import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginVendorAccountFrom } from "@/components/modules/Authentication/LoginVendorAccountFrom";
import vandorLogin from "../../../../assets/Auth/VendorLogin.png";
import GoBackButton from "@/hooks/GoBackButton";
import { RouteLoadingIndicator } from "@/hooks/page-transition";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";

export default function LoginVendor() {
  const navigate = useNavigate();
  const { data: userData, isLoading } = useGetUserProfileQuery(undefined);
  const user = userData?.data;

  // Redirect if user already exists
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/"); // change to your dashboard route
    }
  }, [user, isLoading, navigate]);

  // Show loading while fetching or redirecting
  if (isLoading || user) {
    return <RouteLoadingIndicator />;
  }

  // Render login form only for non-logged-in users
  return (
    <section className="min-h-screen bg-primary/10 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Login Form */}
          <div className="space-y-10">
            {/* Header */}
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Log In
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Welcome back to your CyberNark NIS2 Supplier Risk Dashboard.
                Log in to continue managing cybersecurity compliance, risk management, and audit preparedness.
                <GoBackButton />
              </p>
            </div>

            <LoginVendorAccountFrom />
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex justify-center">
            <img
              src={vandorLogin}
              alt="Team working together on compliance"
              width={650}
              height={650}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
