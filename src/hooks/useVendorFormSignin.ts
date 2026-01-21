/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
// src/hooks/useVendorFormSignin.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateVendorMutation } from "@/redux/features/auth/auth.api";
import { vendorFormSchema, type VendorFormData } from "@/validation/vendorValidation";
import toast from "react-hot-toast";

export const useVendorFormSignin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [createVendor, { isLoading, isSuccess, isError }] = useCreateVendorMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      companyName: "",
      businessEmail: "",
      contactNumber: "",
      industryType: "",
      termsAccepted: false,
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: VendorFormData) => {
    try {
      
      // Prepare the data in the format backend expects
      const payload = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        businessEmail: data.businessEmail,
        contactNumber: data.contactNumber,
        industryType: data.industryType,
        termsAccepted: data.termsAccepted,
      };

      
      const result = await createVendor(payload).unwrap();

      // CHECK IF USER NOT VERIFIED
      if (result?.data?.user?.isVerified === false) {
        const email = data.email;
        window.location.href = `/verify/${encodeURIComponent(email)}`;
        return;
      }

      reset();
    } catch (error : any) {
      if(error?.status === 409){
        toast.error("Vendor with this email already exists.")
      }
      else{
      toast.error("Failed to create vendor:",error.massage)

      }
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    isError,
    showPassword,
    togglePasswordVisibility,
    setValue,
    watch,
  };
};