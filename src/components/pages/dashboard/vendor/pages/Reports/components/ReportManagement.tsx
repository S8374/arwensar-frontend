/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/report/components/ReportsManagement.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Eye, Mail, Trash2, RefreshCw, DownloadCloud } from "lucide-react";
import { 
  useGetReportsQuery, 
  useGetReportDocumentMutation,
  useSendReportMutation,
  useDeleteReportMutation 
} from "@/redux/features/report/report.api";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ExportReportsModal from "../model/ExportReportModal";

export default function ReportsManagement() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isDownloadingAll, setIsDownloadingAll] = useState(false); // Track bulk download state

  // API hooks
  const { data: reportsData, refetch, isLoading } = useGetReportsQuery({
    page: 1,
    limit: 50, // Increased limit to fetch more reports if needed
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  
  const [getReportDocument] = useGetReportDocumentMutation();
  const [sendReport, { isLoading: isSending }] = useSendReportMutation();
  const [deleteReport] = useDeleteReportMutation();

  const reports = reportsData?.data?.reports || [];

  const handleDownload = async (reportId: string, fileName: string) => {
    try {
      const blob = await getReportDocument(reportId).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName.replace(/[^a-zA-Z0-9]/g, "_") || "report"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`"${fileName}" downloaded successfully`);
    } catch (error) {
      toast.error(`Failed to download report: ${fileName}`);
      console.error(error);
    }
  };

  // NEW: Download All Reports
  const handleDownloadAll = async () => {
    if (reports.length === 0) {
      toast.info("No reports available to download");
      return;
    }

    setIsDownloadingAll(true);
    toast.loading(`Downloading ${reports.length} report(s)...`, { id: "download-all" });

    let successCount = 0;
    let failCount = 0;

    for (const report of reports) {
      try {
        const blob = await getReportDocument(report.id).unwrap();
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${(report.title || "Untitled_Report").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to download report ID: ${report.id}`, error);
      }

      // Small delay to prevent browser blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsDownloadingAll(false);
    toast.dismiss("download-all");

    if (failCount === 0) {
      toast.success(`All ${successCount} report(s) downloaded successfully!`);
    } else {
      toast.warning(
        `${successCount} downloaded, ${failCount} failed. Check console for details.`
      );
    }
  };

  const handleView = (report: any) => {
    if (report.documentUrl?.includes("cloudinary")) {
      window.open(report.documentUrl, "_blank");
    } else {
      handleDownload(report.id, report.title);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    
    try {
      await deleteReport(reportId).unwrap();
      toast.success("Report deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  const handleSendReport = async () => {
    if (!selectedReport || !recipientEmail) return;
    
    try {
      await sendReport({
        reportId: selectedReport.id,
        recipientEmail,
      }).unwrap();
      
      toast.success("Report sent successfully");
      setIsSendDialogOpen(false);
      setRecipientEmail("");
      setSelectedReport(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send report");
    }
  };

  const getReportTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      RISK_ASSESSMENT: "bg-red-100 text-red-800",
      COMPLIANCE_REPORT: "bg-blue-100 text-blue-800",
      SUPPLIER_EVALUATION: "bg-green-100 text-green-800",
      SECURITY_AUDIT: "bg-purple-100 text-purple-800",
      PERFORMANCE_REVIEW: "bg-amber-100 text-amber-800",
      INCIDENT_REPORT: "bg-orange-100 text-orange-800",
      VENDOR_SUMMARY: "bg-indigo-100 text-indigo-800",
      CUSTOM: "bg-indigo-100 text-indigo-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      GENERATED: "bg-blue-100 text-blue-800",
      VIEWED: "bg-green-100 text-green-800",
      SENT: "bg-purple-100 text-purple-800",
      ARCHIVED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Report Management</h2>
          <p className="text-muted-foreground">
            Generate, manage, and distribute supplier reports
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {/* NEW: Download All Button */}
          <Button
            variant="secondary"
            onClick={handleDownloadAll}
            disabled={isDownloadingAll || reports.length === 0}
          >
            <DownloadCloud className={`w-4 h-4 mr-2 ${isDownloadingAll ? "animate-bounce" : ""}`} />
            {isDownloadingAll ? "Downloading..." : "Download All"}
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Recent Reports {reports.length > 0 && `(${reports.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports yet</h3>
              <p className="text-muted-foreground mb-6">
                Generate your first report to get started
              </p>
              <Button onClick={() => setIsExportModalOpen(true)}>
                Create Report
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report: any) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Report Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-muted rounded-lg flex-shrink-0">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-medium truncate max-w-md">{report.title}</h4>
                            <Badge className={getReportTypeBadge(report.reportType)}>
                              {report.reportType.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline" className={getStatusBadge(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {report.description || "No description"}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {format(new Date(report.createdAt), "MMM d, yyyy h:mm a")}
                            </span>
                            <span>•</span>
                            <span>PDF • {formatFileSize(report.fileSize || 0)}</span>
                            {report.supplierId && (
                              <>
                                <span>•</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  Supplier Report
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(report)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(report.id, report.title)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedReport(report);
                                setIsSendDialogOpen(true);
                              }}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(report.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Report Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Report</DialogTitle>
            <DialogDescription>
              Send the report to a recipient via email
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-name">Report</Label>
                <Input 
                  id="report-name" 
                  value={selectedReport.title} 
                  readOnly 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="recipient-email">Recipient Email *</Label>
                <Input
                  id="recipient-email"
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSendDialogOpen(false);
                setRecipientEmail("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendReport}
              disabled={!recipientEmail || isSending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? "Sending..." : "Send Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export / Generate Modal */}
      <ExportReportsModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
      />
    </div>
  );
}