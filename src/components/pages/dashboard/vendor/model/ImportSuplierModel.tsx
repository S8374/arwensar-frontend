import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/lib/FileUploader";
import { useState } from "react";
import { useImportSupplyerMutation } from "@/redux/features/vendor/vendor.api";

interface ImportSuppliersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImportSuppliersModal({
  open,
  onOpenChange,
}: ImportSuppliersModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [importSuppliers, { isLoading }] = useImportSupplyerMutation();

  const handleFilesUpload = (files: File[]) => {
    console.log("Files received in modal:", files);
    setUploadedFiles(files);
  };

  const handleSave = async () => {
    if (uploadedFiles.length === 0) {
      console.log("No files to upload");
      return;
    }

    console.log("Saving files:", uploadedFiles);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("files", file);
      });

      console.log("FormData created, sending to API...");
      
      // Uncomment to actually call the API
       const result = await importSuppliers({ files: uploadedFiles }).unwrap();
       console.log("API Response:", result);
      
      console.log("Files would be uploaded to:", "/vendor/import-suppliers");
      console.log("Files ready for upload:", uploadedFiles);
      
      // Close modal after successful "upload"
      onOpenChange(false);
      setUploadedFiles([]); // Clear files
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleCancel = () => {
    console.log("Modal closed, uploaded files:", uploadedFiles);
    setUploadedFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 ">
          <DialogTitle className="text-xl font-semibold">
            Import Suppliers
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Upload supporting documents or multiple files with progress tracking.
          </p>
        </DialogHeader>

        {/* Uploader Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <ImageUploader 
            onFilesUpload={handleFilesUpload}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 bg-background">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="bg-chart-6 text-background hover:bg-chart-6/90"
            onClick={handleSave}
            disabled={uploadedFiles.length === 0 || isLoading}
          >
            {isLoading ? "Uploading..." : "Save Evidence"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}