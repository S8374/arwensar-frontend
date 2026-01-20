// src/components/pages/dashboard/supplier/ReportsPage.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetReportsQuery } from "@/redux/features/report/report.api";
import { format } from "date-fns"; // Add this import for nice date formatting

interface Report {
  id: string;
  title: string;
  description: string;
  reportType: string;
  createdAt: string;
  status: string;
  documentUrl: string;
  documentType: string;
  fileSize: number;
}

export default function ReportsPage() {

  const { data: reportsResponse, isLoading } = useGetReportsQuery({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc", // Optional: newest first
  });

  const reports: Report[] = reportsResponse?.data || [];

  const getFrameworkFromType = (type: string) => {
    if (type === "RISK_ASSESSMENT") return "Risk Assessment";
    // Add more mappings if you have other report types (e.g., NIS2, etc.)
    return type.replace("_", " ");
  };

  const getStatusBadge = (status: string) => {
    if (status === "GENERATED") {
      return <Badge className="bg-green-100 text-green-700 border border-green-200">Completed</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };



const viewReport = (report: Report) => {
  if (!report.documentUrl) return;

  // Open in new tab
  window.open(report.documentUrl, "_blank", "noopener,noreferrer");
};


  if (isLoading) {
    return <div className="p-8 text-center">Loading reports...</div>;
  }

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
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Generated Reports</h2>
          {reports.length === 0 && (
            <p className="text-muted-foreground mt-4">No reports generated yet.</p>
          )}
        </div>

        {reports.length > 0 && (
          <Card className="border shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b">
                      <TableHead className="font-semibold text-foreground">Report Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Type / Framework</TableHead>
                      <TableHead className="font-semibold text-foreground">Generated Date</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground">Size</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-chart-6" />
                            <div>
                              <div className="truncate max-w-xs font-medium">{report.title || "Untitled Report"}</div>
                              <div className="text-sm text-muted-foreground">{report.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-muted text-foreground">
                            {getFrameworkFromType(report.reportType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(report.createdAt), "MMMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(report.status)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatFileSize(report.fileSize)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* PDF Download Button */}
                           <Button
  onClick={() => viewReport(report)}
  variant="outline"
  size="sm"
  className="h-9 px-3 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
>
  <Eye className="w-4 h-4 text-red-600 mr-1.5" />
  <span className="text-red-600 font-medium text-xs sm:text-sm">
    See Report
  </span>
</Button>

                            {/* Placeholder for Excel if available in future */}
                            {/* <Button variant="outline" size="sm" disabled>...</Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}