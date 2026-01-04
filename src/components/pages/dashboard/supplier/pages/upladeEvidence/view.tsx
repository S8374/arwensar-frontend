/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/supplier/components/ViewDocumentModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  FileText,
  Download,
  ExternalLink,
  CalendarIcon,
  User,
  Shield,
  EyeOff,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileType,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Document {
  [x: string]: any;
  id: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  expiryDate?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  isPrivate?: boolean;
  accessRoles?: string[];
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  uploadedBy?: {
    id: string;
    email: string;
    role: string;
  };
}

interface ViewDocumentModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewDocumentModal({
  document,
  isOpen,
  onClose,
}: ViewDocumentModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  if (!document) return null;

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "Unknown";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("doc")) return "📝";
    if (fileType.includes("excel") || fileType.includes("xls")) return "📊";
    if (fileType.includes("image")) return "🖼️";
    return "📎";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "PENDING":
      case "UNDER_REVIEW":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status === "UNDER_REVIEW" ? "Under Review" : "Pending"}
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-destructive/10 text-destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDownload = async () => {
    if (!document.url) {
      toast.error("No file available for download");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(document.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = document.name || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Document downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewInNewTab = () => {
    if (!document.url) {
      toast.error("No file available to view");
      return;
    }

    // For PDFs, open directly in new tab
    if (document.mimeType?.includes("pdf") || document.type?.includes("PDF")) {
      window.open(document.url, "_blank");
    } else {
      // For images, open in new tab
      if (document.mimeType?.startsWith("image/")) {
        window.open(document.url, "_blank");
      } else {
        // For other files, try to download first
        handleDownload();
      }
    }
  };

  const formatCategory = (cat: string) =>
    cat.charAt(0) + cat.slice(1).toLowerCase().replace(/_/g, " ");

  const isImage = document.mimeType?.startsWith("image/");
  const isPDF = document.mimeType?.includes("pdf") || document.type?.includes("PDF");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {document.name}
          </DialogTitle>
          <DialogDescription>
            View document details and evidence
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Document Preview</h3>
              <div className="flex items-center gap-2">
                {getStatusBadge(document.status)}
              </div>
            </div>

            {isImage ? (
              <div className="flex justify-center">
                <img
                  src={document.url}
                  alt={document.name}
                  className="max-h-96 rounded-lg border shadow-sm"
                  onLoad={() => setIsLoadingPreview(false)}
                  onError={() => setIsLoadingPreview(false)}
                />
                {isLoadingPreview && (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
              </div>
            ) : isPDF ? (
              <div className="h-96 border rounded-lg bg-white">
                <iframe
                  src={document.url}
                  title={document.name}
                  className="w-full h-full rounded-lg"
                  onLoad={() => setIsLoadingPreview(false)}
                />
                {isLoadingPreview && (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-white">
                <div className="text-6xl mb-4">{getFileIcon(document.mimeType || document.type)}</div>
                <p className="text-lg font-medium">{document.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  This file type cannot be previewed. Please download to view.
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>File Type: {document.type || document.mimeType}</p>
                {document.fileSize && (
                  <p>Size: {formatFileSize(document.fileSize)}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewInNewTab}
                  disabled={isDownloading}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {isPDF || isImage ? "Open" : "Download"}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">
                  Document Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label className="text-xs">Name</Label>
                      <p className="font-medium">{document.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileType className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label className="text-xs">Type & Category</Label>
                      <div className="flex gap-2">
                        <Badge variant="outline">{document.type}</Badge>
                        <Badge variant="secondary">
                          {formatCategory(document.category)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {document.description && (
                    <div>
                      <Label className="text-xs">Description</Label>
                      <p className="text-sm text-gray-700 mt-1">
                        {document.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">
                  Upload Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label className="text-xs">Uploaded By</Label>
                      <p className="font-medium">
                        {document.uploadedBy?.email || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label className="text-xs">Uploaded Date</Label>
                      <p className="font-medium">
                        {format(new Date(document.createdAt), "PPP 'at' p")}
                      </p>
                    </div>
                  </div>

                  {document.updatedAt && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <Label className="text-xs">Last Updated</Label>
                        <p className="font-medium">
                          {format(new Date(document.updatedAt), "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Status & Permissions */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">
                  Status & Expiry
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Current Status</Label>
                    {getStatusBadge(document.status)}
                  </div>

                  {document.expiryDate && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label>Expiry Date</Label>
                        <span
                          className={cn(
                            "font-medium",
                            new Date(document.expiryDate) < new Date() &&
                              "text-destructive"
                          )}
                        >
                          {format(new Date(document.expiryDate), "PPP")}
                        </span>
                      </div>
                      {new Date(document.expiryDate) < new Date() ? (
                        <p className="text-sm text-destructive">
                          This document has expired
                        </p>
                      ) : (
                        <p className="text-sm text-green-600">
                          Expires in{" "}
                          {Math.ceil(
                            (new Date(document.expiryDate).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </p>
                      )}
                    </div>
                  )}

                  {document.reviewedAt && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <Label className="text-xs">Reviewed On</Label>
                          <p className="font-medium">
                            {format(new Date(document.reviewedAt), "PPP")}
                          </p>
                        </div>
                      </div>

                      {document.reviewNotes && (
                        <div>
                          <Label className="text-xs">Review Notes</Label>
                          <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                            {document.reviewNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">
                  Permissions
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {document.isPrivate ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                    <div>
                      <Label className="text-xs">Visibility</Label>
                      <p className="font-medium">
                        {document.isPrivate ? "Private" : "Public"}
                      </p>
                    </div>
                  </div>

                  {document.accessRoles && document.accessRoles.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <div>
                        <Label className="text-xs">Access Roles</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {document.accessRoles.map((role) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">
                  Technical Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">File URL:</span>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-[200px]"
                      title={document.url}
                    >
                      {document.url.substring(0, 50)}...
                    </a>
                  </div>
                  {document.mimeType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">MIME Type:</span>
                      <span>{document.mimeType}</span>
                    </div>
                  )}
                  {document.fileSize && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">File Size:</span>
                      <span>{formatFileSize(document.fileSize)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}