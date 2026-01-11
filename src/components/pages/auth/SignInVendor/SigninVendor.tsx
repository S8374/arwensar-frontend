import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoBackAndHomeButtons from "@/hooks/GoBackButton";
import vandorSignin from "../../../../assets/Auth/signInVector.png";
import CreateVendorAccountFrom from "@/components/modules/Authentication/CreateVendorAccountFrom";
import { RouteLoadingIndicator } from "@/hooks/page-transition";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";

export default function SignInVendor() {
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

  // Render signup form only for non-logged-in users
  return (
    <section className="min-h-screen bg-primary/10 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Form */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Create Vendor Account
              </h1>
              <p className="text-lg text-muted-foreground">
                To get access to your CyberNark NIS2 Supplier Risk Dashboard, 
                you need to complete registration to focus on cybersecurity compliance, 
                risk management, and audit preparedness.
              </p>
              <GoBackAndHomeButtons/>
            </div>

            <CreateVendorAccountFrom/>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <img
                src={vandorSignin}
                alt="Vendor working on compliance"
                width={600}
                height={600}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
