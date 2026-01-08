/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vendorProfileSchema,
  supplierProfileSchema,
} from "@/validation/profile";
import { useUpdateUserProfileMutation } from "@/redux/features/user/user.api";

export const useProfile = (initialData: any, isVendor: boolean) => {
  const [updateProfile, status] = useUpdateUserProfileMutation();

  const form = useForm({
    resolver: zodResolver(isVendor ? vendorProfileSchema : supplierProfileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: any) => {
    await updateProfile({
      ...data,
      role: isVendor ? "VENDOR" : "SUPPLIER",
    }).unwrap();
    form.reset(data);
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
    ...status,
  };
};
