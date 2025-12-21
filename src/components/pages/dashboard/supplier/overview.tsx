// src/components/pages/dashboard/supplier/ComplianceDashboard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";
import OverviewStatsCard from "./components/overviewComponent/OverviewStatsCard";
import ComplianceTable from "./components/overviewComponent/Compliancetable";
import SendAlertModal from "../vendor/pages/SupplierManagement/model/SendAlertModal";

export default function ComplianceDashboard() {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Arwen</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Welcome back, <strong>Acme Suppliers Inc</strong>. Here's your compliance overview.
            </p>
          </div>

          {/* Notify Vendor Button – Responsive Design */}
          <Button
            onClick={() => setIsAlertModalOpen(true)}
            className="bg-chart-6 hover:bg-chart-6/90 text-background font-medium shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-auto py-2 sm:py-3 px-4 sm:px-5 rounded-lg sm:rounded-xl w-full sm:w-auto"
          >
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">Notify Vendor</span>
            </div>
            <span className="text-xs opacity-90 mt-1 hidden sm:block">
              Send alert or update
            </span>
          </Button>
        </div>

        {/* Stats */}
        <OverviewStatsCard />

        {/* Table */}
        <ComplianceTable />
      </div>

      {/* Send Alert Modal */}
      <SendAlertModal
        open={isAlertModalOpen}
        onOpenChange={setIsAlertModalOpen}
        supplierName="Acme Suppliers Inc"
        supplierId="sup_123"
      />
    </>
  );
}