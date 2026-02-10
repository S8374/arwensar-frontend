// src/pages/vendor/VendorDashboard.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ComplianceDonutChart from "./component/OverViewComponent/ComplianceDonutChart";
import ComplianceGaugeCard from "./component/OverViewComponent/ComplianceGaugeCard";
import RecentAlerts from "./component/OverViewComponent/RecentAlerts";
import SupplierTable from "./component/OverViewComponent/SupplierTable";
import StatsCards from "./component/OverViewComponent/StatsCards";
import AddSupplierModal from "./model/AddSuplierModel";
import { useState } from "react";
import { useGetVendorStatsQuery } from "@/redux/features/vendor/vendor.api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getPlanFeatures } from "@/lib/planFeatures";
import FeatureRestricted from "@/components/upgrade/FeatureRestricted";

export default function VendorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: userData } = useUserInfoQuery(undefined);
  const plan = userData?.data?.subscription;

  const permissions = getPlanFeatures(plan);
// src/pages/vendor/VendorDashboard.tsx
const { data, isLoading, isError } = useGetVendorStatsQuery(undefined, {
  refetchOnFocus: true,
  refetchOnReconnect: true,
  // NO pollingInterval here
});

  const stats = data?.data;
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (isError || !stats) {
    return <ErrorState />;
  }

  // Prepare data for charts
  const complianceDonutData = [
    { name: "Low Risk", value: stats.complianceOverview.lowRisk, color: "#10b981" },
    { name: "Medium Risk", value: stats.complianceOverview.mediumRisk, color: "#f59e0b" },
    { name: "High Risk", value: stats.complianceOverview.highRisk, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen space-y-8 pb-12 pt-6 max-w-screen-2xl mx-auto">
      {/* Header - Enhanced with gradient and better spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            Monitor all suppliers and their compliance status in real-time. Track performance, risks, and compliance metrics.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards - Enhanced with hover effects */}
      <StatsCards stats={stats} />

      {/* Main Content Grid - Enhanced with better spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-8">
          {
            permissions.complianceDashboard || permissions.isAllFeaturesAccessible ? <ComplianceDonutChart data={complianceDonutData} /> : <FeatureRestricted
              title="Compliance Dashboard"
              description="Visualize compliance distribution with interactive charts"
              requiredPlan="premium"
              feature="compliance_dashboard"
              className="h-full"
            />
          }

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="transform hover:scale-[1.02] transition-transform duration-200">
            {
              permissions.overallCompliance || permissions.isAllFeaturesAccessible ? <ComplianceGaugeCard
                compliancePercentage={stats.complianceGauge.compliancePercentage}
                compliant={stats.complianceGauge.compliantSuppliers}
                nonCompliant={stats.complianceGauge.nonCompliantSuppliers}
                total={stats.supplierStats.totalSuppliers}
              /> : <FeatureRestricted
                title="overallCompliance "
                description="Visualize compliance distribution with interactive charts"
                requiredPlan="premium"
                feature="compliance_dashboard"
                className="h-full"
              />
            }

          </div>
          <div className="transform hover:scale-[1.02] transition-transform duration-200">
            <RecentAlerts alerts={stats.recentUpdates} />
          </div>
        </div>
      </div>

      {/* Supplier Table - Enhanced with glass effect */}
      <Card className=" border-0 bg-linear-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <SupplierTable  />
        </CardContent>
      </Card>

      {/* Modal */}
      <AddSupplierModal  open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}

// Enhanced Loading Skeleton with shimmer effect
function DashboardSkeleton() {
  return (
    <div className="min-h-screen space-y-8 pb-12 pt-6 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-5 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-48 rounded-lg" />
      </div>

      {/* Stats Cards Skeleton with shimmer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl">
            <Skeleton className="h-32 w-full" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-xl">
            <Skeleton className="h-96 w-full" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="relative overflow-hidden rounded-xl">
            <Skeleton className="h-64 w-full" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="relative overflow-hidden rounded-xl">
            <Skeleton className="h-72 w-full" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="relative overflow-hidden rounded-xl">
        <Skeleton className="h-96 w-full" />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}

// Enhanced Error State
function ErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Failed to Load Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We encountered an issue while loading your dashboard data.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Try Again
        </Button>
      </Card>
    </div>
  );
}