// src/hooks/useNotification.ts
import { useState } from "react";

export type NotificationFormData = {
  emailNotifications: boolean;
  riskAlerts: boolean;
  contractReminders: boolean;
  complianceUpdates: boolean;
  assessmentReminders: boolean;
  messageAlerts: boolean;
};

export const useNotification = () => {
  const [preferences, setPreferences] = useState<NotificationFormData>({
    emailNotifications: true,
    riskAlerts: true,
    contractReminders: true,
    complianceUpdates: true,
    assessmentReminders: true,
    messageAlerts: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleToggle = (key: keyof NotificationFormData) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }, 1000); // simulate save delay
  };

  return {
    preferences,
    handleToggle,
    handleSubmit,
    isLoading,
    isSuccess,
  };
};
