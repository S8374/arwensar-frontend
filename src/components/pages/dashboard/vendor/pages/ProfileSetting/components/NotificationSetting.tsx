/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// src/components/NotificationSetting.tsx
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Mail, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  MessageSquare,
  Calendar,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
  useGetNotificationPreferencesQuery, 
  useUpdateNotificationPreferencesMutation 
} from "@/redux/features/user/user.api";
import { toast } from "sonner";

export default function NotificationSetting() {
  const { data, isLoading: isLoadingPrefs } = useGetNotificationPreferencesQuery();
  const [updatePreferences, { isLoading: isSaving }] = useUpdateNotificationPreferencesMutation();

  // Local state for toggles
  const [preferences, setPreferences] = useState({
    emailNotifications: false,
    riskAlerts: true,
    contractReminders: true,
    assessmentReminders: true,
    messageAlerts: true,
    paymentAlerts: true,
    problemAlerts: true,
    reportAlerts: true,
  });

  // Sync with backend data when loaded
  useEffect(() => {
    if (data?.data) {
      setPreferences({
        emailNotifications: data.data.emailNotifications ?? false,
        riskAlerts: data.data.riskAlerts ?? true,
        contractReminders: data.data.contractReminders ?? true,
        assessmentReminders: data.data.assessmentReminders ?? true,
        messageAlerts: data.data.messageAlerts ?? true,
        paymentAlerts: data.data.paymentAlerts ?? true,
        problemAlerts: data.data.problemAlerts ?? true,
        reportAlerts: data.data.reportAlerts ?? true,
      });
    }
  }, [data]);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updatePreferences(preferences).unwrap();
      toast.success("Notification preferences saved successfully!");
    } catch (error) {
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  const fields = [
    { label: "Email Notifications", icon: Mail, key: "emailNotifications" },
    { label: "High Risk Alerts", icon: AlertTriangle, key: "riskAlerts" },
    { label: "Contract Reminders", icon: Calendar, key: "contractReminders" },
    { label: "Assessment Reminders", icon: FileText, key: "assessmentReminders" },
    { label: "New Messages", icon: MessageSquare, key: "messageAlerts" },
    { label: "Payment Alerts", icon: CreditCard, key: "paymentAlerts" },
    { label: "Problem Reports", icon: AlertTriangle, key: "problemAlerts" },
    { label: "Report Generation", icon: FileText, key: "reportAlerts" },
  ];

  return (
    <div className="w-full mx-auto space-y-8 py-8">
      

      {/* Loading State */}
      {isLoadingPrefs ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-muted/30 rounded-xl animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg" />
                <div className="h-6 bg-muted rounded w-48" />
              </div>
              <div className="w-12 h-6 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.key}
                className="flex items-center justify-between p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-xl bg-chart-6/10 group-hover:bg-chart-6/20 transition-colors">
                    <Icon className="w-6 h-6 text-chart-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{field.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {field.key === "emailNotifications" && "Get updates via email"}
                      {field.key === "riskAlerts" && "Critical risk changes"}
                      {field.key === "contractReminders" && "Expiring contracts"}
                      {field.key === "assessmentReminders" && "Pending assessments"}
                      {field.key === "messageAlerts" && "New messages from suppliers"}
                      {field.key === "paymentAlerts" && "Payment status updates"}
                      {field.key === "problemAlerts" && "Reported issues"}
                      {field.key === "reportAlerts" && "Generated reports"}
                    </p>
                  </div>
                </div>

                <Switch
                  checked={preferences[field.key as keyof typeof preferences]}
                  onCheckedChange={() => handleToggle(field.key as keyof typeof preferences)}
                  className="data-[state=checked]:bg-chart-6"
                />
              </div>
            );
          })}

          {/* Save Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              size="lg"
              disabled={isSaving}
              className="px-10 bg-chart-6 hover:bg-chart-6/90 shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}