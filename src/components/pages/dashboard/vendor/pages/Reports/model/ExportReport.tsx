/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, FileText, Image, File, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export default function FileUploadModal({ open, onOpenChange }: FileUploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fileType, setFileType] = useState<"documents" | "images" | "all">("documents");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload progress
    newFiles.forEach((fileObj, _index) => {
      simulateUpload(fileObj.id);
    });
  }, []);

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: 'completed' as const }
              : f
          )
        );
        clearInterval(interval);
      } else {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: Math.min(progress, 99) }
              : f
          )
        );
      }
    }, 200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 10,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpload = () => {
    
    // Simulate final upload completion
    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setUploadedFiles([]);
    setFileType("documents");
    onOpenChange(false);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return <FileText className="w-4 h-4 text-green-600" />;
    } else {
      return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            Upload Files
          </DialogTitle>
          <p className="text-sm text-muted-foreground -mt-1">
            Drag and drop files or click to browse. Supports images, PDFs, and documents.
          </p>
        </DialogHeader>

        <div className="space-y-5 py-4 overflow-y-auto">
          {/* File Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">File Type</Label>
            <Select value={fileType} onValueChange={(value: any) => setFileType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="documents">Documents Only</SelectItem>
                <SelectItem value="images">Images Only</SelectItem>
                <SelectItem value="all">All File Types</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to select files from your computer
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Supports: PNG, JPG, PDF, DOC, DOCX, XLS, XLSX</p>
              <p>Max file size: 50MB • Max files: 10</p>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Selected Files ({uploadedFiles.length})</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {uploadedFiles.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      {getFileIcon(fileObj.file.type)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileObj.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {fileObj.status === 'completed' && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          {fileObj.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(fileObj.id)}
                            className="h-6 w-6 p-0 hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatFileSize(fileObj.file.size)}</span>
                        <span>{fileObj.file.type}</span>
                      </div>

                      {/* Progress Bar */}
                      {fileObj.status === 'uploading' && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${fileObj.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Summary */}
          {uploadedFiles.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Upload Summary</h4>
              <div className="space-y-1 text-xs text-blue-800">
                <div className="flex justify-between">
                  <span>Total Files:</span>
                  <span className="font-medium">{uploadedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Size:</span>
                  <span className="font-medium">
                    {formatFileSize(uploadedFiles.reduce((total, fileObj) => total + fileObj.file.size, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium">
                    {uploadedFiles.filter(f => f.status === 'completed').length} / {uploadedFiles.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 sm:justify-between border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || uploadedFiles.some(f => f.status === 'uploading')}
            className="bg-blue-600 hover:bg-blue-700 min-w-[140px]"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadedFiles.some(f => f.status === 'uploading') ? 'Uploading...' : 'Upload Files'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}