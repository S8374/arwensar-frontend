import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileData } from "@/validation/profile";
import { useUpdateUserProfileMutation } from "@/redux/features/user/user.api";

// src/hooks/useProfile.ts - Update the field mapping
export const useProfile = (initialData?: any) => {
  const [updateProfile, { isLoading, isSuccess, isError }] = useUpdateUserProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialData?.vendor?.firstName || "",
      lastName: initialData?.vendor?.lastName || "",
      email: initialData?.email || "", // This is user email, not vendor field
      companyName: initialData?.vendor?.companyName || "", // Changed from 'company'
      contactNumber: initialData?.vendor?.contactNumber || "", // Changed from 'phone'
      industryType: initialData?.vendor?.industryType || "",
    },
  });

  const onSubmit = async (data: ProfileData) => {
    try {
      console.log("Profile data submitted:", data);
      
      // Map form data to API expected format
      const apiData = {
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        contactNumber: data.contactNumber,
        industryType: data.industryType,
        // Note: email is not sent to vendor update endpoint
        // email: data.email // This should be updated separately if needed
      };
      
      await updateProfile(apiData).unwrap();
      console.log("Profile updated successfully!");
      reset(data);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    isError,
    isDirty,
    reset,
  };
};