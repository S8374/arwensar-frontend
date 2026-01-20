/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";
import { useMinioUpload } from "@/lib/useMinioUpload";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileProps = {
  isVendor: boolean;
};

export default function Profile({ isVendor }: ProfileProps) {
  const {
    data: userData,
    isLoading: isProfileLoading,
  } = useGetUserProfileQuery();

  const { uploadFile, isUploading } = useMinioUpload();

  // ---------- Show loading skeleton ----------
  if (isProfileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // ---------- Prepare profile data ----------
  const profileData = isVendor
    ? {
        firstName: userData?.data?.vendorProfile?.firstName || "",
        lastName: userData?.data?.vendorProfile?.lastName || "",
        email: userData?.data?.email || "",
        companyName: userData?.data?.vendorProfile?.companyName || "",
        contactNumber: userData?.data?.vendorProfile?.contactNumber || "",
        industryType: userData?.data?.vendorProfile?.industryType || "",
        profileImage: userData?.data?.profileImage || "",
      }
    : {
        firstName: userData?.data?.supplierProfile?.contactPerson || "",
        email: userData?.data?.email || "",
        companyName:
          userData?.data?.supplierProfile?.vendor?.companyName || "",
        contactNumber: userData?.data?.supplierProfile?.phone || "",
        industryType:
          userData?.data?.supplierProfile?.vendor?.industryType || "",
        profileImage: userData?.data?.profileImage || "",
      };

  // ---------- useProfile hook ----------
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    isLoading,
    isSuccess,
    isError,
  } = useProfile(profileData, isVendor);

  // ---------- Image upload ----------
  const handleImageUpload = async (file: File) => {
    const url = await uploadFile(file);
    setValue("profileImage", url, { shouldDirty: true });
  };

  return (
    <div className="space-y-8">
      {/* SUCCESS */}
      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            Profile updated successfully!
          </p>
        </div>
      )}

      {/* ERROR */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            Failed to update profile. Please try again.
          </p>
        </div>
      )}

      {/* TITLE */}
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-chart-6" />
        <h2 className="text-xl font-semibold">Profile Information</h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>First Name</Label>
            <Input {...register("firstName")} disabled={isLoading} />
            {errors.firstName && (
              <p className="text-red-500 text-sm">
                {errors.firstName.message as string}
              </p>
            )}
          </div>

          {isVendor && (
            <div>
              <Label>Last Name</Label>
              <Input {...register("lastName")} disabled={isLoading} />
            </div>
          )}

          <div>
            <Label>Email</Label>
            <Input value={profileData.email} disabled />
          </div>

          <div>
            <Label>Company Name</Label>
            <Input {...register("companyName")} disabled />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input {...register("contactNumber")} disabled={isLoading} />
          </div>

          <div>
            <Label>Industry Type</Label>
            <Input {...register("industryType")} disabled />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              {profileData.profileImage && (
                <img
                  src={profileData.profileImage}
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImageUpload(e.target.files[0])
                }
                disabled={isUploading}
              />

              {isUploading && (
                <span className="text-sm text-muted-foreground">
                  Uploading...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SAVE */}
        <Button
          type="submit"
          disabled={!isDirty || isLoading || isUploading}
          className="bg-chart-6 px-8"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
