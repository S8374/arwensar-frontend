/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/pages/dashboard/shared/CreateProblemForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useCreateProblemMutation } from "@/redux/features/problem/problem.api";
import { useGetMySuppliersQuery } from "@/redux/features/vendor/vendor.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Upload, X, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useCloudinaryUpload } from "@/lib/useCloudinaryUpload";

const createProblemSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be detailed"),
  type: z.enum([
    "QUALITY_ISSUE",
    "DELIVERY_DELAY",
    "COMMUNICATION",
    "CONTRACT_VIOLATION",
    "PAYMENT_ISSUE",
    "COMPLIANCE",
    "TECHNICAL",
    "OTHER"
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  supplierId: z.string().min(1, "Please select a supplier").optional(),
  dueDate: z.string().optional(),
});

type CreateProblemFormData = z.infer<typeof createProblemSchema>;

export default function CreateProblemForm({ onSuccess }: { onSuccess: () => void }) {
  const { data: userData } = useUserInfoQuery(undefined);
  const userRole = userData?.data?.role;

  const [createProblem, { isLoading: isSubmitting }] = useCreateProblemMutation();
  const { data: suppliersData } = useGetMySuppliersQuery(undefined, {
    skip: userRole !== "VENDOR",
  });

  const suppliers = suppliersData?.data || [];

  const {
    uploadFiles,
    isUploading,
    uploadProgress,
    uploadError,
    uploadedUrls,
    resetUpload
  } = useCloudinaryUpload();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewFiles, setPreviewFiles] = useState<{ name: string; size: string }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<CreateProblemFormData>({
    resolver: zodResolver(createProblemSchema),
  });

  const direction = userRole === "VENDOR" ? "VENDOR_TO_SUPPLIER" : "SUPPLIER_TO_VENDOR";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map(file => ({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    }));

    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewFiles(prev => [...prev, ...newPreviews]);
    resetUpload(); // Reset upload state
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateProblemFormData) => {
    let attachmentUrls: string[] = [];

    if (selectedFiles.length > 0) {
      try {
        attachmentUrls = await uploadFiles(selectedFiles);
      } catch (err) {
            
        return; // Error already handled in hook
      }
    }

    try {
      const payload: any = {
        ...data,
        direction,
        attachments: attachmentUrls,
      };

      if (userRole === "VENDOR") {
        if (!data.supplierId) {
          toast.error("Please select a supplier");
          return;
        }
        payload.supplierId = data.supplierId;
      }

      await createProblem(payload).unwrap();
      toast.success("Problem reported successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to report problem");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Brief summary of the issue"
          {...register("title")}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Provide detailed explanation..."
          className="min-h-32"
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Type & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Issue Type *</Label>
          <Select onValueChange={(value) => setValue("type", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="QUALITY_ISSUE">Quality Issue</SelectItem>
              <SelectItem value="DELIVERY_DELAY">Delivery Delay</SelectItem>
              <SelectItem value="COMMUNICATION">Communication</SelectItem>
              <SelectItem value="CONTRACT_VIOLATION">Contract Violation</SelectItem>
              <SelectItem value="PAYMENT_ISSUE">Payment Issue</SelectItem>
              <SelectItem value="COMPLIANCE">Compliance</SelectItem>
              <SelectItem value="TECHNICAL">Technical</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Priority *</Label>
          <Select onValueChange={(value) => setValue("priority", value as any)} defaultValue="MEDIUM">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Supplier Selection (Only for Vendor) */}
      {userRole === "VENDOR" && (
        <div className="space-y-2">
          <Label>Supplier *</Label>
          <Select onValueChange={(value) => setValue("supplierId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.length === 0 ? (
                <SelectItem value="none" disabled>No suppliers found</SelectItem>
              ) : (
                suppliers.map((supplier: any) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name} ({supplier.email})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.supplierId && <p className="text-sm text-red-600">{errors.supplierId.message}</p>}
        </div>
      )}

      {/* Due Date */}
      <div className="space-y-2">
        <Label>Due Date (Optional)</Label>
        <Input type="date" {...register("dueDate")} />
      </div>

      {/* File Attachments */}
      <div className="space-y-4">
        <Label>Attachments (Optional)</Label>
        
        {/* Upload Area */}
        <label className="block">
          <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isUploading ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-gray-50"}`}>
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <div>
                  <p className="font-medium">Uploading {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}...</p>
                  <Progress value={uploadProgress} className="mt-3 max-w-xs mx-auto" />
                </div>
                <div className="mt-4 space-y-2">
                  {uploadedUrls.map((_url, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 text-sm text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      {previewFiles[i]?.name} uploaded
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium">Click to upload files</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, Word, Images, up to 20MB each
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>

        {/* Selected Files Preview */}
        {previewFiles.length > 0 && !isUploading && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected files ({previewFiles.length})</p>
            <div className="space-y-2">
              {previewFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? "Reporting..." : "Report Problem"}
        </Button>
      </div>
    </form>
  );
}