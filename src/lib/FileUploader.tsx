import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFilesUpload?: (files: File[]) => void;
  className?: string;
}

export default function FileUploader({ onFilesUpload, className }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped/selected:", acceptedFiles);
    
    // Log detailed file information
    acceptedFiles.forEach((file, index) => {
      console.log(`File ${index + 1}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
    });

    setFiles(acceptedFiles);
    if (onFilesUpload) {
      onFilesUpload(acceptedFiles);
    }
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    console.log("Removing file:", fileToRemove.name);
    
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesUpload) {
      onFilesUpload(newFiles);
    }
  };

  return (
    <div className={cn("p-6", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? "Drop files here..." : "Drag & drop files here, or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports images, PDF, Word documents (max 10MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600 truncate flex-1">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
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
    </div>
  );
}