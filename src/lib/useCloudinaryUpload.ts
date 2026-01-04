// src/hooks/useCloudinaryUpload.ts
import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/uploadFileToCloudinary';
import toast from 'react-hot-toast';

export const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Overall progress (0–100)
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  /**
   * Upload a single file to Cloudinary
   */
  const uploadSingleFile = async (file: File): Promise<string> => {
    const result = await uploadToCloudinary(file);
    return result.url;
  };

  /**
   * Upload multiple files (for attachments)
   * Returns array of uploaded URLs
   */
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) {
      return [];
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    setUploadedUrls([]);

    const uploaded: string[] = [];
    let completed = 0;

    try {
      // Upload files one by one (or in parallel — choose based on needs)
      // Here: sequential with progress update
      for (const file of files) {
        const url = await uploadSingleFile(file);
        uploaded.push(url);
        completed++;

        // Update overall progress
        setUploadProgress(Math.round((completed / files.length) * 100));
        setUploadedUrls([...uploaded]); // Live preview of uploaded files
      }

      setUploadProgress(100);
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully!`);
      return uploaded;
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(message);
      toast.error(message);
      throw error; // Re-throw so caller can handle
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Upload a single file (kept for backward compatibility)
   */
  const uploadFile = async (file: File): Promise<string> => {
    const urls = await uploadFiles([file]);
    return urls[0];
  };

  /**
   * Reset upload state
   */
  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedUrls([]);
  };

  return {
    // Single file upload
    uploadFile,
    // Multiple files upload (recommended for attachments)
    uploadFiles,
    // Current state
    isUploading,
    uploadProgress,
    uploadError,
    uploadedUrls, // Live list of successfully uploaded URLs
    resetUpload,
  };
};