import { useGetVendorStatsQuery } from "@/redux/features/vendor/vendor.api";
import StatsCards from "../../../component/OverViewComponent/StatsCards";
import SupplierTable from "../../../component/OverViewComponent/SupplierTable";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";

export default function VendorSupplierManageSection() {
  const { data, isLoading } = useGetVendorStatsQuery(undefined);
  const {
    data: userData,
  } = useGetUserProfileQuery();
  const stats = data?.data;
  const firstName = userData?.data?.vendorProfile?.firstName || "User";
  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-20">
      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-center sm:text-left">
          Welcome Back, {firstName}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base text-center sm:text-left">
          Monitor all suppliers and their compliance status
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="px-4 sm:px-6 lg:px-0">
        {/* Stats Cards */}
        {isLoading ? <StatsCardsSkeleton /> : <StatsCards stats={stats} />}
      </div>

      {/* Supplier Table Section */}
      <div className="px-4 sm:px-6 lg:px-0">
        <SupplierTable />
      </div>
    </div>
  );
};

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {Array(8).fill(0).map((_, i) => (
        <Card key={i} className="p-5">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-6 w-24 mt-3" />
        </Card>
      ))}
    </div>
  );
}