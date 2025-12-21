import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { dashboardData } from "@/data";
import ComplianceDonutChart from "./component/OverViewComponent/ComplianceDonutChart";
import ComplianceGaugeCard from "./component/OverViewComponent/ComplianceGaugeCard";
import RecentAlerts from "./component/OverViewComponent/RecentAlerts";
import SupplierTable from "./component/OverViewComponent/SupplierTable";
import StatsCards from "./component/OverViewComponent/StatsCards";
import { useState } from "react";
import AddSupplierModal from "./model/AddSuplierModel";
import { useGetVendorStatsQuery } from "@/redux/features/vendor/vendor.api";

export default function VendorDashboard() {
  const {
    complianceOverview,
    totalCompliant,
    pending,
    nonCompliant,
    recentAlerts,
  } = dashboardData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {data} = useGetVendorStatsQuery(undefined);
  console.log("My stats data",data);
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
            Welcome Back, Arwen
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Monitor all suppliers and their compliance status
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-chart-6 hover:bg-chart-6/90 w-full sm:w-auto shrink-0"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Grid and Alerts - Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Compliance Donut Chart - Takes 2 columns on xl, full width on smaller screens */}
        <div className="xl:col-span-2">
          <ComplianceDonutChart data={complianceOverview} />
        </div>
        
        {/* Compliance Gauge Card - Takes 1 column on xl, half width on md, full width on smaller */}
        <div className="md:col-span-1 xl:col-span-1">
          <ComplianceGaugeCard
            totalCompliant={totalCompliant}
            compliant={10}
            pending={pending}
            nonCompliant={nonCompliant}
          />
        </div>
        
        {/* Recent Alerts - Takes 1 column on xl, half width on md, full width on smaller */}
        <div className="md:col-span-1 xl:col-span-1">
          <RecentAlerts alerts={recentAlerts} />
        </div>
      </div>

      {/* Supplier Table */}
      <div className="grid grid-cols-1">
        <SupplierTable  />
      </div>

      {/* Modal */}
      <AddSupplierModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}