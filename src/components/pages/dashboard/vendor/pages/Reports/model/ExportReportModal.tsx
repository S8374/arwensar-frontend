/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
// src/modules/report/model/ExportReportModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  useGenerateReportMutation,
  useGetVendorReportOptionsQuery,
  useBulkGenerateReportsMutation 
} from "@/redux/features/report/report.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ExportReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ReportType = 
  | "RISK_ASSESSMENT" 
  | "COMPLIANCE_REPORT" 
  | "SUPPLIER_EVALUATION" 
  | "SECURITY_AUDIT"
  | "PERFORMANCE_REVIEW"
  | "INCIDENT_REPORT"
  | "VENDOR_SUMMARY";

export default function ExportReportsModal({
  open,
  onOpenChange,
}: ExportReportsModalProps) {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [reportType, setReportType] = useState<ReportType>("RISK_ASSESSMENT");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supplierIds, setSupplierIds] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState<boolean | "indeterminate">(false);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    riskLevel: [] as string[],
  });

  // API hooks
  const { data: vendorOptions } = useGetVendorReportOptionsQuery(undefined, {
    skip: !open,
  });
  
  const [generateReport, { isLoading: isGenerating }] = useGenerateReportMutation();
  const [bulkGenerate, { isLoading: isBulkGenerating }] = useBulkGenerateReportsMutation();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setStep("select");
    setReportType("RISK_ASSESSMENT");
    setTitle("");
    setDescription("");
    setSupplierIds([]);
    setBulkMode(false);
    setFilters({
      startDate: "",
      endDate: "",
      riskLevel: [],
    });
  };

  const handleSubmit = async () => {
    try {
      if (bulkMode && supplierIds.length > 0) {
        // Bulk generate for multiple suppliers
        await bulkGenerate({
          reportType,
          title: title || `${reportType} Report`,
          description,
          supplierIds,
          filters: {
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
          },
          options: {
            sendEmail: false,
            includeRecommendations: true,
          },
        }).unwrap();
        
        toast.success(`Generated ${supplierIds.length} reports successfully`);
      } else {
        // Single report generation
        await generateReport({
          reportType,
          title: title || `${reportType} Report`,
          description,
          supplierId: supplierIds[0] || undefined,
          filters: {
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            riskLevel: filters.riskLevel.length > 0 ? filters.riskLevel : undefined,
          },
        }).unwrap();
        
        toast.success("Report generated successfully");
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to generate report");
    }
  };

  const getReportTypeLabel = (type: ReportType): string => {
    const labels: Record<ReportType, string> = {
      RISK_ASSESSMENT: "Risk Assessment Report",
      COMPLIANCE_REPORT: "Compliance Report",
      SUPPLIER_EVALUATION: "Supplier Evaluation",
      SECURITY_AUDIT: "Security Audit Report",
      PERFORMANCE_REVIEW: "Performance Review",
      INCIDENT_REPORT: "Incident Report",
      VENDOR_SUMMARY: "Vendor Summary",
    };
    return labels[type] || type;
  };

  const handleSupplierToggle = (supplierId: string) => {
    if (supplierIds.includes(supplierId)) {
      setSupplierIds(supplierIds.filter(id => id !== supplierId));
    } else {
      setSupplierIds([...supplierIds, supplierId]);
    }
  };

  const handleSelectAll = () => {
    if (supplierIds.length === vendorOptions?.suppliers?.length) {
      setSupplierIds([]);
    } else {
      setSupplierIds(vendorOptions?.suppliers?.map((s: any) => s.id) || []);
    }
  };

  const isFormValid = () => {
    if (reportType === "SUPPLIER_EVALUATION" && !bulkMode) {
      return supplierIds.length === 1 && title.trim().length > 0;
    }
    return title.trim().length > 0;
  };

  const renderStepSelect = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="report-type">Report Type</Label>
          <Select
            value={reportType}
            onValueChange={(value) => setReportType(value as ReportType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RISK_ASSESSMENT">Risk Assessment</SelectItem>
              <SelectItem value="COMPLIANCE_REPORT">Compliance Report</SelectItem>
              <SelectItem value="SUPPLIER_EVALUATION">Supplier Evaluation</SelectItem>
              <SelectItem value="SECURITY_AUDIT">Security Audit</SelectItem>
              <SelectItem value="PERFORMANCE_REVIEW">Performance Review</SelectItem>
              <SelectItem value="INCIDENT_REPORT">Incident Report</SelectItem>
              <SelectItem value="VENDOR_SUMMARY">Vendor Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mode">Generation Mode</Label>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="single" 
                checked={!bulkMode}
                onCheckedChange={(checked) => setBulkMode(!checked)}
              />
              <Label htmlFor="single">Single Report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bulk" 
                checked={bulkMode}
                onCheckedChange={setBulkMode}
              />
              <Label htmlFor="bulk">Bulk Generate</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={() => setStep("configure")}>
          Next: Configure
        </Button>
      </div>
    </div>
  );

  const renderStepConfigure = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Report Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter report title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description for the report"
            rows={3}
          />
        </div>
      </div>

      {/* Supplier Selection */}
      {reportType !== "VENDOR_SUMMARY" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Select Suppliers</Label>
            {bulkMode && (
              <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                {supplierIds.length === vendorOptions?.suppliers?.length 
                  ? "Deselect All" 
                  : "Select All"}
              </Button>
            )}
          </div>
          
          <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
            {vendorOptions?.suppliers?.length ? (
              <div className="space-y-2">
                {vendorOptions.suppliers.map((supplier: any) => (
                  <div key={supplier.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`supplier-${supplier.id}`}
                      checked={supplierIds.includes(supplier.id)}
                      onCheckedChange={() => handleSupplierToggle(supplier.id)}
                      disabled={!bulkMode && supplierIds.length >= 1 && !supplierIds.includes(supplier.id)}
                    />
                    <Label 
                      htmlFor={`supplier-${supplier.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      {supplier.name} 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        supplier.riskLevel === 'HIGH' || supplier.riskLevel === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {supplier.riskLevel || 'UNKNOWN'}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No suppliers found</p>
            )}
          </div>
          
          {!bulkMode && reportType === "SUPPLIER_EVALUATION" && (
            <p className="text-sm text-muted-foreground">
              Select exactly one supplier for evaluation report
            </p>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        <Label>Filters (Optional)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
        </div>

        {reportType === "RISK_ASSESSMENT" && (
          <div>
            <Label>Risk Level Filter</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((level) => (
                <div key={level} className="flex items-center space-x-1">
                  <Checkbox
                    id={`risk-${level}`}
                    checked={filters.riskLevel.includes(level)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({...filters, riskLevel: [...filters.riskLevel, level]});
                      } else {
                        setFilters({...filters, riskLevel: filters.riskLevel.filter(r => r !== level)});
                      }
                    }}
                  />
                  <Label htmlFor={`risk-${level}`} className="text-sm">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Preview */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Report Preview:</strong> {getReportTypeLabel(reportType)} - {title || "Untitled"}
          {reportType === "VENDOR_SUMMARY" && " (Vendor Summary for all suppliers)"}
          {bulkMode && supplierIds.length > 0 && ` (${supplierIds.length} suppliers)`}
          {!bulkMode && supplierIds[0] && vendorOptions?.suppliers?.find((s: any) => s.id === supplierIds[0])?.name && 
            ` for ${vendorOptions.suppliers.find((s: any) => s.id === supplierIds[0])?.name}`}
        </p>
      </div>

      <DialogFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          onClick={() => setStep("select")}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!isFormValid() || isGenerating || isBulkGenerating}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          {(isGenerating || isBulkGenerating) ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Report
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Generate comprehensive reports for suppliers and vendors
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? renderStepSelect() : renderStepConfigure()}
      </DialogContent>
    </Dialog>
  );
}