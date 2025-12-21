import { Button } from "@/components/ui/button";

import { Download } from "lucide-react";
import ReportsStatsCards from "./components/ReportsStatsCards";
import ReportsManagement from "./components/ReportManagement";
import { useState } from "react";
import ExportReportsModal from "./model/ExportReport";

export default function ReportsPage() {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-foreground">Reports & Exports</h1>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setIsExportModalOpen(true)}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground px-6 pb-4">
                    Generate audit-ready reports for your suppliers
                </p>
            </div>

            <div className="p-6 space-y-8">
                {/* Stats Cards */}
                <ReportsStatsCards />

                {/* Export Section */}

                <ReportsManagement />

            </div>
            {/* Export Modal */}
            <ExportReportsModal
                open={isExportModalOpen}
                onOpenChange={setIsExportModalOpen}
            />
        </div>
    );
}