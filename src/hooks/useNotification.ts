// src/hooks/useNotification.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetNotificationPreferencesQuery, useUpdateNotificationPreferencesMutation } from "@/redux/features/notification/notification.api";

const notificationSchema = z.object({
  emailNotification: z.boolean().default(true),
  highRiskAlert: z.boolean().default(true),
  contractReminders: z.boolean().default(true),
  complianceUpdate: z.boolean().default(true),
  assessmentReminders: z.boolean().default(true).optional(),
  newMessageAlert: z.boolean().default(true).optional(),
});

export type NotificationData = z.infer<typeof notificationSchema>;

export const useNotification = () => {
  // Fetch current preferences
  const { data: notificationData, isLoading: isFetching } = useGetNotificationPreferencesQuery(undefined);
  
  // Update mutation
  const [updatePreferences, { isLoading: isUpdating, isSuccess, isError }] = 
    useUpdateNotificationPreferencesMutation();

  const [initialValues, setInitialValues] = useState<NotificationData>({
    emailNotification: true,
    highRiskAlert: true,
    contractReminders: true,
    complianceUpdate: true,
    assessmentReminders: true,
    newMessageAlert: true,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<NotificationData>({
    resolver: zodResolver(notificationSchema) as any,
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Update form when data is fetched
  useEffect(() => {
    if (notificationData?.data) {
      const preferences = notificationData.data;
      const newValues = {
        emailNotification: preferences.emailNotification,
        highRiskAlert: preferences.highRiskAlert,
        contractReminders: preferences.contractReminders,
        complianceUpdate: preferences.complianceUpdate,
        assessmentReminders: preferences.assessmentReminders,
        newMessageAlert: preferences.newMessageAlert,
      };
      setInitialValues(newValues);
      reset(newValues);
    }
  }, [notificationData, reset]);

  const onSubmit = async (data: NotificationData) => {
    try {
      console.log("Updating notification preferences:", data);
      await updatePreferences(data).unwrap();
      console.log("Notification preferences updated successfully!");
    } catch (error) {
      console.error("Failed to update notification preferences:", error);
    }
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isDirty,
    isLoading: isFetching || isUpdating,
    isSuccess,
    isError,
    preferences: notificationData?.data || initialValues,
  };
};