/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSupplyerMutation } from "@/redux/features/auth/auth.api";
import { supplyerFormSchema, type SupplyerFormData } from "@/validation/supplyerValidation";
import toast from "react-hot-toast";

export const useSupplyerFormignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createVendor, { isLoading, isSuccess, isError }] = useCreateSupplyerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SupplyerFormData>({
    resolver: zodResolver(supplyerFormSchema),
    defaultValues: {
      company: "",
      email: "",
      phone: "",
      industry: "",
      password: "",
      confirm: "",
      terms: false,
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: SupplyerFormData) => {
    try {
      const payload = {
        password: data.password,
        vendor: {
          companyName: data.company,
          businessEmail: data.email,
          contactNumber: data.phone,
          industryType: data.industry,
          termsCondition: data.terms,
          
        },
      };

      await createVendor(payload).unwrap();

      toast.success("Vendor account created successfully!");
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create vendor");
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
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    setValue,
    watch,
  };
};