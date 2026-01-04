// src/lib/uploadFileToCloudinary.ts
export const uploadToCloudinary = async (file: File) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary config. Check .env");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "suppliers/documents");

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Cloudinary upload failed:", error);
    throw new Error(error.error?.message || "Upload failed");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
  };
};