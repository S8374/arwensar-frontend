import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alertSchema, type AlertData } from "@/validation/alert";
import { useNotifyMyVendorMutation } from "@/redux/features/supplyer/supplyer.api";

interface UseSendAlertProps {
  onSuccess?: () => void;
  supplierId?: string;
}

export const useSendAlert = ({ onSuccess, supplierId }: UseSendAlertProps = {}) => {
  const [sendAlert, { isLoading, isSuccess, isError, data }] = useNotifyMyVendorMutation();

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
      priority: "HIGH", // ✅ FIXED
      description: "",
    },

  });

  const onSubmit = async (data: AlertData) => {
    try {
      console.log("Alert data submitted:", {
        ...data,
        supplierId,
        timestamp: new Date().toISOString(),
      });

      // Prepare data for API
      const alertData = {
        ...data,
        ...(supplierId && { supplierId }),
      };

      // Uncomment to actually call the API
      const result = await sendAlert(alertData).unwrap();

      // For demo purposes, log success
      console.log("Alert sent successfully:", alertData, result);

      // Reset form on success
      reset();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to send alert:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    setValue,
    watch,
    errors,
    isLoading,
    isSuccess,
    isError,
    isDirty,
    isValid,
    reset,
    alertResponse: data,
  };
};