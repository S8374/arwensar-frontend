/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/supplier/pages/upladeEvidence/upladeEvidence.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CalendarIcon,
  Eye,
  Replace,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useRef } from "react";

import toast from "react-hot-toast";
import { useGetDocumentCategoriesQuery, useGetDocumentsQuery, useUploadDocumentMutation } from "@/redux/features/document/document.api";
import { SimpleReplaceModal } from "./ReplaceDocumentModal";
import { ViewDocumentModal } from "./view";
import { useMinioUpload } from "@/lib/useMinioUpload";

// Default fallback categories (in case API fails)
const FALLBACK_CATEGORIES = [
  "CERTIFICATE",
  "CONTRACT",
  "INSURANCE",
  "LICENSE",
  "COMPLIANCE",
  "FINANCIAL",
  "OTHER",
] as const;

type Category = (typeof FALLBACK_CATEGORIES)[number];

export default function EvidenceUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isPrivate, setIsPrivate] = useState(false);
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Upload hook
  const { uploadFile, isUploading, uploadProgress, resetUpload } =
    useMinioUpload();

  const [uploadDocument, { isLoading: isSubmitting }] =
    useUploadDocumentMutation();

  // Fetch documents
  const {
    data: documentsData,
    isLoading: docsLoading,
    refetch,
  } = useGetDocumentsQuery({
    category: filterCategory === "all" ? undefined : filterCategory,
    status: filterStatus === "all" ? undefined : filterStatus,
    page: 1,
    limit: 50,
  });

  // Fetch categories with safe handling
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useGetDocumentCategoriesQuery();

  const categories: Category[] = categoriesData?.categories || FALLBACK_CATEGORIES;
  const documents = documentsData?.data || [];
  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setType(file.name.split(".").pop()?.toUpperCase() || "");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setType(file.name.split(".").pop()?.toUpperCase() || "");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !name || !type || !category) {
      toast.error("Please fill in all required fields: file, name, and category.");
      return;
    }

    try {
      // Upload to Cloudinary
      const fileUrl = await uploadFile(selectedFile);

      // Prepare form data
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", name);
      formData.append("type", type);
      formData.append("category", category);
      if (description) formData.append("description", description);
      if (expiryDate) formData.append("expiryDate", expiryDate.toISOString().split("T")[0]);
      formData.append("isPrivate", String(isPrivate));
      formData.append("accessRoles", JSON.stringify(isPrivate ? ["ADMIN", "VENDOR"] : ["ADMIN", "VENDOR", "SUPPLIER"]));

      // Alternatively, use the mutation directly if it accepts file upload
      await uploadDocument({
        name,
        type,
        category,
        fileUrl, // Cloudinary URL
        fileSize: selectedFile.size, // Add fileSize
        mimeType: selectedFile.type, // Add mimeType
        description: description || undefined,
        expiryDate: expiryDate ? expiryDate.toISOString().split("T")[0] : undefined,
        isPrivate,
        accessRoles: isPrivate ? ["ADMIN", "VENDOR"] : ["ADMIN", "VENDOR", "SUPPLIER"],
      }).unwrap();

      toast.success("Document uploaded successfully!");
      resetForm();
      refetch();
      resetUpload();
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error(err?.data?.message || "Failed to upload document");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setName("");
    setType("");
    setCategory("");
    setDescription("");
    setExpiryDate(undefined);
    setIsPrivate(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleViewClick = (doc: any) => {
    setSelectedDocument(doc);
    setViewModalOpen(true);
  };

  // Handle replace button click
  const handleReplaceClick = (doc: any) => {
    setSelectedDocument(doc);
    setReplaceModalOpen(true);
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


  // Handle replace success
  const handleReplaceSuccess = () => {
    toast.success("Document replaced successfully!");
    refetch(); // Refresh the document list
  };

  const formatCategory = (cat: string) =>
    cat.charAt(0) + cat.slice(1).toLowerCase().replace(/_/g, " ");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="mx-auto  px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground">Upload Evidence</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your compliance documents, certificates, and policies.
          </p>
        </div>
      </div>

      <div className="mx-auto  px-6 py-10 space-y-10">
        {/* Upload Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-10 text-center transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">
                  {selectedFile
                    ? selectedFile.name
                    : "Drop file here or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  PDF, DOCX, XLSX, PNG, JPG (Max 10MB)
                </p>
              </label>
              {selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change File
                </Button>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading to Cloudinary...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Document Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ISO 27001 Certificate"
                />
              </div>

              <div>
                <Label>File Type</Label>
                <Input value={type || "Not detected"} disabled />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as Category)}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        categoriesLoading ? "Loading categories..." : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {formatCategory(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Expiry Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : "No expiry"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the document..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={(c) => setIsPrivate(c as boolean)}
                />
                <Label htmlFor="private" className="cursor-pointer">
                  Make private (visible only to admins and vendors)
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isUploading ||
                  isSubmitting ||
                  !selectedFile ||
                  !name ||
                  !category
                }
              >
                {(isUploading || isSubmitting) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploading
                  ? "Uploading File..."
                  : isSubmitting
                    ? "Submitting..."
                    : "Upload Document"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue
                placeholder={categoriesLoading ? "Loading..." : "All Categories"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {formatCategory(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {docsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No documents uploaded yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.mimeType || doc.type}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.category ? formatCategory(doc.category) : "—"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(doc.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {doc.expiryDate ? (
                          <span
                            className={cn(
                              doc.status === "EXPIRED" && "text-destructive font-medium"
                            )}
                          >
                            {format(new Date(doc.expiryDate), "MMM d, yyyy")}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewClick(doc)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReplaceClick(doc)}
                          >
                            <Replace className="w-4 h-4 mr-1" />
                            Replace
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
  
        <SimpleReplaceModal
          document={selectedDocument}
          isOpen={replaceModalOpen}
          onClose={() => setReplaceModalOpen(false)}
          onSuccess={handleReplaceSuccess}
        />
        <ViewDocumentModal
          document={selectedDocument}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />
      </div>
    </div>
  );
}