// src/components/pages/dashboard/supplier/ReportsPage.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetReportsQuery } from "@/redux/features/report/report.api";

const reports = [
  { name: "NIS2 Compliance Overview", framework: "NIS2", date: "2025-02-15", status: "Completed" },
  { name: "NIS2 Compliance Overview", framework: "NIS2", date: "2025-02-15", status: "Completed" },
  { name: "NIS2 Compliance Overview", framework: "NIS2", date: "2025-02-15", status: "Completed" },
];

export default function ReportsPage() {
  const [_isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: reportsData, refetch, isLoading } = useGetReportsQuery();
  console.log(reportsData);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              View compliance reports and export audit documentation
            </p>
          </div>

          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-chart-6 hover:bg-chart-6/90 text-white font-medium"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Generated Reports</h2>
        </div>

        <Card className="border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 border-b">
                    <TableHead className="font-semibold text-foreground">Report Name</TableHead>
                    <TableHead className="font-semibold text-foreground">Framework</TableHead>
                    <TableHead className="font-semibold text-foreground">Generated Date</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="text-right font-semibold text-foreground">Export</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report, index) => (
                    <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-chart-6" />
                          <span className="truncate max-w-xs">{report.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-muted text-foreground">
                          {report.framework}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {report.date}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 border border-green-200">
                          Completed
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* PDF Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
                          >
                            <FileText className="w-4 h-4 text-red-600 mr-1.5" />
                            <span className="text-red-600 font-medium text-xs sm:text-sm">PDF</span>
                          </Button>

                          {/* Excel Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-green-600 mr-1.5" />
                            <span className="text-green-600 font-medium text-xs sm:text-sm">Excel</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}