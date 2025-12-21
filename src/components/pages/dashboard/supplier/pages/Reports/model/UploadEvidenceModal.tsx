// src/components/modals/UploadEvidenceModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, X } from "lucide-react";

interface UploadEvidenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadEvidenceModal({ open, onOpenChange }: UploadEvidenceModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("Includes the updated evidence log, internal updated GDPR policy document");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center justify-between">
            Upload Evidence for this Question
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Attach relevant documents or screenshots that support your answer.
          </p>
        </DialogHeader>

        <div className="mt-6">
          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed  rounded-lg p-10 text-center  transition-colors bg-background/80"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-chart-6" />
              </div>
              <p className="text-foreground font-medium">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground mt-2">
                Accepts PDF, DOCX, XLSX, PNG, JPG (Max 10MB each)
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="mt-4" variant="outline" asChild>
                  <span>Choose Files</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-chart-6/75 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-chart-6" />
                    </div>
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-6">
            <label className="text-sm font-medium text-foreground">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any context about these files..."
              className="mt-2 min-h-24 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-chart-6 "
              disabled={files.length === 0}
              onClick={() => {
                // Handle upload
                onOpenChange(false);
              }}
            >
              Save Evidence
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}