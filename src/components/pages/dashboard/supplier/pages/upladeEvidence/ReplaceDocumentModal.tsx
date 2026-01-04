/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/supplier/pages/uploadEvidence/ReplaceDocumentModal.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateDocumentMutation } from "@/redux/features/document/document.api";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useMinioUpload } from "@/lib/useMinioUpload";

interface ReplaceDocumentModalProps {
  document: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SimpleReplaceModal({
  document,
  isOpen,
  onClose,
  onSuccess,
}: ReplaceDocumentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [updateDocument] = useUpdateDocumentMutation();

  // ✅ Correct hook usage: call at top-level
  const minioUploadHook = useMinioUpload();

  const handleReplace = async () => {
    if (!document || !selectedFile) return;

    setIsUploading(true);
    try {
      // ✅ Call the upload function returned by the hook
      const fileUrl = await minioUploadHook.uploadFile(selectedFile);
      console.log("file url",fileUrl);
      // Prepare payload for document update
      const updatePayload = {
        documentId: document.id,
        data: {
          name: document.name, // keep original name
          url: fileUrl,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type,
          status: "PENDING", // reset status
          type: selectedFile.name.split(".").pop()?.toUpperCase() || document.type,
          description: document.description,
          category: document.category,
          expiryDate: document.expiryDate,
          isPrivate: document.isPrivate,
          accessRoles: document.accessRoles,
        },
      };

      await updateDocument(updatePayload as any).unwrap();

      toast.success("Document replaced successfully!");
      onSuccess?.();
      onClose();
      setSelectedFile(null); // reset input
    } catch (error: any) {
      console.error("Replace failed:", error);
      toast.error(error?.data?.message || "Failed to replace document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 10MB.");
      return;
    }

    // Validate allowed file types
    const allowedExtensions = ["pdf", "doc", "docx", "png", "jpg", "jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error(`File type not allowed. Allowed types: ${allowedExtensions.join(", ")}`);
      return;
    }

    setSelectedFile(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Replace Document</DialogTitle>
          <DialogDescription>
            Upload a new file to replace "{document?.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="replace-file">Select New File</Label>
            <Input
              id="replace-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Maximum file size: 10MB. Allowed types: PDF, DOC, DOCX, PNG, JPG, JPEG
            </p>
          </div>

          {selectedFile && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="font-medium text-yellow-800">Note</p>
            <p className="mt-1 text-yellow-700">
              • Uploading a new file will replace the current document completely
              <br />
              • The document status will be reset to "Pending" for review
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReplace}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Replacing...
              </>
            ) : (
              "Replace Document"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
