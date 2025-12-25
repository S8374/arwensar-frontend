import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alertSchema, type AlertData } from "@/validation/alert";

interface UseSendAlertProps {
  onSuccess?: () => void;
  supplierId?: string;
}

export const useSendAlert = ({
  onSuccess,
  supplierId,
}: UseSendAlertProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
    watch,
    control,
  } = useForm<AlertData>({
    resolver: zodResolver(alertSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      priority: "HIGH",
      description: "",
    },
  });

  const onSubmit = async (formData: AlertData) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      const payload = {
        ...formData,
        ...(supplierId && { supplierId }),
        createdAt: new Date().toISOString(),
      };

      // ✅ Simulate async behavior (no API)
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("Alert submitted (local only):", payload);

      setData(payload);
      setIsSuccess(true);
      reset();

      onSuccess?.();
    } catch (error) {
      console.error("Alert submit failed:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    setValue,
    watch,
    errors,

    // status flags
    isLoading,
    isSuccess,
    isError,

    // form state
    isDirty,
    isValid,

    reset,
    alertResponse: data,
  };
};
