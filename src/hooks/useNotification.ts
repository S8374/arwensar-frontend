// src/hooks/useNotification.ts
import { useForm, type ControllerProps, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/redux/features/user/user.api";
import toast from "react-hot-toast";
import { useEffect } from "react";

// Match EXACTLY with backend field names
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  riskAlerts: z.boolean(),
  contractReminders: z.boolean(),
  complianceUpdates: z.boolean(),
  assessmentReminders: z.boolean(),
  messageAlerts: z.boolean(),
});

export type NotificationFormData = z.infer<typeof notificationSchema>;

export const useNotification = (): {
  control: ControllerProps["control"];
  handleSubmit: UseFormReturn<NotificationFormData>["handleSubmit"];
  isDirty: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  preferences: NotificationFormData | undefined;
  isFetching: boolean;
  reset: () => void;
} => {
  const {
    data: preferencesData,
    isLoading: isFetching,
    isError: fetchError,
    refetch,
  } = useGetNotificationPreferencesQuery(undefined);

  const [updatePreferences, { isLoading: isUpdating, isSuccess, isError }] =
    useUpdateNotificationPreferencesMutation();
   console.log("preferencesData:", preferencesData);
  // Debug log
  console.log("Preferences from API:", preferencesData);

  const defaultValues: NotificationFormData = {
    emailNotifications: preferencesData?.emailNotifications ?? true,
    riskAlerts: preferencesData?.riskAlerts ?? true,
    contractReminders: preferencesData?.contractReminders ?? true,
    complianceUpdates: preferencesData?.complianceUpdates ?? true,
    assessmentReminders: preferencesData?.assessmentReminders ?? true,
    messageAlerts: preferencesData?.messageAlerts ?? true,
  };

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
    watch,
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues,
  });

  // Reset form when data loads
  useEffect(() => {
    if (preferencesData) {
      console.log("Resetting form with:", preferencesData);
      reset({
        emailNotifications: preferencesData.emailNotifications ?? true,
        riskAlerts: preferencesData.riskAlerts ?? true,
        contractReminders: preferencesData.contractReminders ?? true,
        complianceUpdates: preferencesData.complianceUpdates ?? true,
        assessmentReminders: preferencesData.assessmentReminders ?? true,
        messageAlerts: preferencesData.messageAlerts ?? true,
      });
    }
  }, [preferencesData, reset]);

  // Watch form values for debugging
  const formValues = watch();
  useEffect(() => {
    console.log("Form values:", formValues);
  }, [formValues]);

  const onSubmit = async (data: NotificationFormData) => {
    console.log("Submitting data:", data);
    try {
      const result = await updatePreferences(data).unwrap();
      console.log("Update successful:", result);
      toast.success("Notification preferences updated successfully!");
      refetch(); // Refresh the data
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update preferences. Please try again.");
    }
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isDirty,
    isLoading: isFetching || isUpdating,
    isSuccess,
    isError: isError || fetchError,
    preferences: preferencesData,
    isFetching,
    reset,
  };
};