// ReportsManagement.tsx – ONLY RESPONSIVE FIXES
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import ExportReportsModal from "../model/ExportReport";

export default function ReportsManagement() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Export Card */}
      <Card>
        <CardHeader>
          <CardTitle>Export Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Responsive Grid: 1 col → 3 col */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date Range</label>
              <Select defaultValue="30">
                <SelectTrigger className="mt-2 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="60">Last 60 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Report Type</label>
              <Select defaultValue="risk">
                <SelectTrigger className="mt-2 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk">Supplier Risk Report</SelectItem>
                  <SelectItem value="compliance">Compliance Summary Report</SelectItem>
                  <SelectItem value="assessment">Full Assessment Report</SelectItem>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Export Format</label>
              <Select defaultValue="excel">
                <SelectTrigger className="mt-2 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview Box – responsive padding */}
          <div className="p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="text-blue-800">
              <strong>Export Preview:</strong> You are about to export a{" "}
              <strong>Supplier Risk Report</strong> for the last{" "}
              <strong>30 days</strong> in <strong>Excel (XLSX)</strong> format.
            </p>
          </div>

          {/* Button – full width on mobile */}
          <div className="flex justify-end">
            <Button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
        <div className="space-y-4">
          {[
            { name: "Complete Supplier Report", date: "2024-10-01 2:44AM", type: "PDF", size: "2.1MB" },
            { name: "Risk Assessment Q3", date: "2024-10-15 11:18AM", type: "Excel", size: "890KB" },
            { name: "Compliance Summary", date: "2024-10-07 8:26AM", type: "PDF", size: "1.4MB" },
          ].map((report, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-lg flex-shrink-0">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.date} • {report.type} • {report.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ExportReportsModal open={isExportModalOpen} onOpenChange={setIsExportModalOpen} />
    </div>
  );
}