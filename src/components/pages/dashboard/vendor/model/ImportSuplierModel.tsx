/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/vendor/model/ImportSuppliersModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/lib/FileUploader";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Loader2, Upload, Video, File } from "lucide-react";
import { useBulkImportSuppliersMutation } from "@/redux/features/vendor/vendor.api";
import VideoModal from "../component/OverViewComponent/VideoModal";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getPlanFeatures } from "@/lib/planFeatures";
import toast from "react-hot-toast";
import { useGetMyUsageQuery } from "@/redux/features/myUsesLimit/my.uses.limit";

interface ImportSuppliersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedSupplier {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH';
  contractStartDate: string;
  contractEndDate: string;
  errors?: any;
}

export default function ImportSuppliersModal({
  open,
  onOpenChange,
}: ImportSuppliersModalProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedSuppliers, setParsedSuppliers] = useState<ParsedSupplier[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [bulkImportSuppliers, { isLoading }] = useBulkImportSuppliersMutation();
    const { refetch} = useGetMyUsageQuery(undefined);

  const parseExcelFile = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true }); // Add cellDates: true
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert with date handling
      const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        raw: false, // Get formatted values
        dateNF: 'dd-mm-yyyy' // Specify date format
      });

      const suppliers: ParsedSupplier[] = [];
      const errors: string[] = [];

      rows.forEach((row: any, index: number) => {
        // Clean the data
        const cleanRow: any = {};
        Object.keys(row).forEach(key => {
          const value = row[key];
          if (typeof value === 'string') {
            cleanRow[key] = value.trim();
          } else if (value instanceof Date) {
            // If Excel date, format it
            cleanRow[key] = formatDateForAPI(value);
          } else {
            cleanRow[key] = value;
          }
        });

        const supplier: ParsedSupplier = {
          name: String(cleanRow.name || cleanRow.Name || ''),
          contactPerson: String(cleanRow.contactPerson || cleanRow['Contact Person'] || ''),
          email: String(cleanRow.email || cleanRow.Email || '').toLowerCase().trim(),
          phone: String(cleanRow.phone || cleanRow.Phone || ''),
          category: String(cleanRow.category || cleanRow.Category || ''),
          criticality: (cleanRow.criticality || cleanRow.Criticality || 'MEDIUM')
            .toString()
            .toUpperCase()
            .trim() as 'LOW' | 'MEDIUM' | 'HIGH',
          contractStartDate: String(cleanRow.contractStartDate || cleanRow['Contract Start'] || ''),
          contractEndDate: String(cleanRow.contractEndDate || cleanRow['Contract End'] || ''),
          errors: [],
        };

        // Clean dates (remove any non-breaking spaces or special characters)
        supplier.contractStartDate = supplier.contractStartDate.replace(/[^\d\-/]/g, ' ');
        supplier.contractEndDate = supplier.contractEndDate.replace(/[^\d\-/]/g, ' ');

        // Validate supplier
        const supplierErrors: string[] = [];

        // Name validation
        if (!supplier.name.trim()) {
          supplierErrors.push("Name is required");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!supplier.email.trim() || !emailRegex.test(supplier.email)) {
          supplierErrors.push("Valid email is required");
        }

        // Phone validation
        if (!supplier.phone.trim()) {
          supplierErrors.push("Phone is required");
        }

        // Criticality validation
        if (!['LOW', 'MEDIUM', 'HIGH'].includes(supplier.criticality)) {
          supplierErrors.push("Criticality must be LOW, MEDIUM, or HIGH");
        }

        // Date validation with better error messages
        const startDate = parseDate(supplier.contractStartDate);
        if (!startDate) {
          supplierErrors.push(`Invalid start date: "${supplier.contractStartDate}". Use DD-MM-YYYY`);
        } else {
          supplier.contractStartDate = formatDateForAPI(startDate);
        }

        const endDate = parseDate(supplier.contractEndDate);
        if (!endDate) {
          supplierErrors.push(`Invalid end date: "${supplier.contractEndDate}". Use DD-MM-YYYY`);
        } else {
          supplier.contractEndDate = formatDateForAPI(endDate);
        }

        // Additional check: end date should be after start date
        if (startDate && endDate && endDate <= startDate) {
          supplierErrors.push("End date must be after start date");
        }

        if (supplierErrors.length > 0) {
          supplier.errors = supplierErrors;
          errors.push(`Row ${index + 2}: ${supplierErrors.join(', ')}`);
        } else {
          // Format dates for display in preview
          supplier.contractStartDate = formatDateForDisplay(startDate!);
          supplier.contractEndDate = formatDateForDisplay(endDate!);
        }

        suppliers.push(supplier);
      });

      setParsedSuppliers(suppliers);
      setValidationErrors(errors);
      setUploadedFile(file);

      if (errors.length === 0 && suppliers.length > 0) {
        setIsPreview(true);
      }


    } catch (error) {
      console.error("Error parsing Excel file:", error);
      setValidationErrors([`Error parsing Excel file: ${error}`]);
    }
  };
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState("https://app.usebubbles.com/fFZSJikSshTGxzVNkWbqhQ"); // default video
  const formatDateForAPI = (date: Date): string => {
    // Format as YYYY-MM-DD for API
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const { data: userData } = useUserInfoQuery(undefined);
  const plan = userData?.data?.subscription;
  const limit = getPlanFeatures(plan);
  const formatDateForDisplay = (date: Date): string => {
    // Format as DD-MM-YYYY for display
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
  // Add these helper functions
  const parseDate = (dateString: string): Date | null => {
    // Try different date formats
    const formats = [
      // DD-MM-YYYY (your format)
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      // YYYY-MM-DD
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      // DD/MM/YYYY
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      // YYYY/MM/DD
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
    ];

    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        if (format === formats[0]) { // DD-MM-YYYY
          const [, day, month, year] = match;
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (format === formats[1]) { // YYYY-MM-DD
          const [, year, month, day] = match;
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (format === formats[2]) { // DD/MM/YYYY
          const [, day, month, year] = match;
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (format === formats[3]) { // YYYY/MM/DD
          const [, year, month, day] = match;
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
      }
    }

    // Try native Date parsing as fallback
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    return null;
  };
  const handleFilesUpload = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setValidationErrors(["Please upload an Excel file (.xlsx, .xls, .csv)"]);
      return;
    }

    setParsedSuppliers([]);
    setValidationErrors([]);
    setIsPreview(false);
    parseExcelFile(file);
  };




  const handleImport = async () => {
    if (parsedSuppliers.length === 0 || validationErrors.length > 0) {
      return;
    }

    try {
      // Ensure all dates are properly formatted
      const suppliersToImport = parsedSuppliers.map(supplier => {
        // Parse and re-format dates to ensure consistency
        const startDate = parseDate(supplier.contractStartDate);
        const endDate = parseDate(supplier.contractEndDate);

        return {
          ...supplier,
          contractStartDate: startDate ? formatDateForAPI(startDate) : supplier.contractStartDate,
          contractEndDate: endDate ? formatDateForAPI(endDate) : supplier.contractEndDate,
        };
      });


      const result = await bulkImportSuppliers({
        suppliers: suppliersToImport
      }).unwrap();


      // Show success summary
      if (result.successful > 0) {
        toast.success(`Successfully imported ${result.successful} suppliers! ${result.failed > 0 ? `${result.failed} failed.` : ''}`);
      }
       refetch();
      // Reset and close
      setUploadedFile(null);
      setParsedSuppliers([]);
      setValidationErrors([]);
      setIsPreview(false);
      onOpenChange(false);

    } catch (error: any) {
      if (error.status === 402) {
        toast.error(
          "You’ve reached your report generation limit. Please upgrade your plan to continue.",
          { duration: 5000 }
        );
      }
      console.error("Error during bulk import:", error);
      setValidationErrors([`Import failed: ${error}`]);
    }
  };

  const handleCancel = () => {
    setUploadedFile(null);
    setParsedSuppliers([]);
    setValidationErrors([]);
    setIsPreview(false);
    onOpenChange(false);
    refetch()
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  const seeDemoVideos = () => {
    // You can dynamically change the URL if you want
    setDemoVideoUrl("https://app.usebubbles.com/fFZSJikSshTGxzVNkWbqhQ");
    setVideoModalOpen(true);
  };
  const seeFile = () => {
    const fileLink = "https://drive.google.com/file/d/1RqUKD8pRVqibmu4E-JaSIZ7-D1CsHNaH/view?usp=sharing";
    window.open(fileLink, "_blank"); // Opens the file/folder in a new tab
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {isPreview ? "Preview & Import Suppliers" : "Import Suppliers"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Supplier creation limit:{" "}
            <span className="font-medium">
              {limit.supplierLimit === null ? (
                <span className="text-emerald-600">Unlimited</span>
              ) : (
                <span className="text-destructive">
                  {limit.supplierLimit}
                </span>
              )}
            </span>
          </p>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {isPreview
              ? `Ready to import ${parsedSuppliers.length} suppliers. Review details below.`
              : "Upload an Excel file to import multiple suppliers at once."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
          {!isPreview ? (
            // Upload Section
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Upload Excel File</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: .xlsx, .xls, .csv
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={seeFile}
                    className="gap-2"
                  >
                    <File className="w-4 h-4" />
                    See Formate / Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={seeDemoVideos}
                    className="gap-2"
                  >
                    <Video className="w-4 h-4" />
                    See Demo Videos
                  </Button>
                </div>
              </div>

              <ImageUploader
                onFilesUpload={handleFilesUpload}
              />

              {uploadedFile && (
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                  <Check className="w-4 h-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • {parsedSuppliers.length} suppliers found
                    </p>
                  </div>
                </div>
              )}

              {validationErrors.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-300">
                      Validation Errors ({validationErrors.length})
                    </h4>
                  </div>
                  <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                    {validationErrors.slice(0, 5).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {validationErrors.length > 5 && (
                      <li className="text-muted-foreground">
                        ...and {validationErrors.length - 5} more errors
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {parsedSuppliers.length > 0 && validationErrors.length === 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        All {parsedSuppliers.length} suppliers validated successfully!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Click "Preview & Import" to review details.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Preview Section
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Preview Suppliers</h3>
                  <p className="text-xs text-muted-foreground">
                    {parsedSuppliers.length} suppliers ready for import
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {parsedSuppliers.length} valid
                </Badge>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Contact</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">Risk</th>
                        <th className="text-left p-3 font-medium">Start Date</th>
                        <th className="text-left p-3 font-medium">End Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {parsedSuppliers.slice(0, 10).map((supplier, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="p-3">{supplier.name}</td>
                          <td className="p-3">{supplier.contactPerson}</td>
                          <td className="p-3">{supplier.email}</td>
                          <td className="p-3">{supplier.category}</td>
                          <td className="p-3">
                            <Badge className={getCriticalityColor(supplier.criticality)}>
                              {supplier.criticality}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {(() => {
                              const d = parseDate(supplier.contractStartDate);
                              return d ? formatDateForDisplay(d) : "—";
                            })()}
                          </td>

                          <td className="p-3">
                            {(() => {
                              const d = parseDate(supplier.contractEndDate);
                              return d ? formatDateForDisplay(d) : "—";
                            })()}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {parsedSuppliers.length > 10 && (
                  <div className="p-3 text-center text-xs text-muted-foreground border-t">
                    Showing first 10 of {parsedSuppliers.length} suppliers
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Email invitations will be sent to all suppliers
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Each supplier will receive an invitation to complete their registration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 px-6 pb-6 pt-4 bg-background border-t">
          <div>
            {parsedSuppliers.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {parsedSuppliers.length} supplier{parsedSuppliers.length !== 1 ? 's' : ''} ready
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>

            {!isPreview ? (
              <Button
                onClick={() => setIsPreview(true)}
                disabled={parsedSuppliers.length === 0 || validationErrors.length > 0 || isLoading}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Preview & Import
              </Button>
            ) : (
              <Button
                onClick={handleImport}
                disabled={isLoading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Import {parsedSuppliers.length} Suppliers
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
      <VideoModal
        open={videoModalOpen}
        onOpenChange={setVideoModalOpen}
        videoUrl={demoVideoUrl}
      />

    </Dialog>
  );
}