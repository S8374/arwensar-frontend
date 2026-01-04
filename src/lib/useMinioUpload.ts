/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useUploadFileMutation } from "@/redux/features/upload/upload.api";
import toast from "react-hot-toast";

export const useMinioUpload = (_selectedFile?: File) => {
  const [uploadFileMutation] = useUploadFileMutation();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadFileMutation(formData).unwrap();
      return res.url;
    } catch (err: any) {
      const message = err?.data?.error || "Upload failed";
      setUploadError(message);
      toast.error(message);
      throw new Error(message);
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    setUploadedUrls([]);

    const uploaded: string[] = [];
    let completed = 0;

    try {
      for (const file of files) {
        const url = await uploadSingleFile(file);
        uploaded.push(url);
        completed++;
        setUploadProgress(Math.round((completed / files.length) * 100));
        setUploadedUrls([...uploaded]);
      }
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully!`);
      return uploaded;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const urls = await uploadFiles([file]);
    return urls[0];
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedUrls([]);
  };

  return {
    uploadFile,
    uploadFiles,
    isUploading,
    uploadProgress,
    uploadError,
    uploadedUrls,
    resetUpload,
  };
};
