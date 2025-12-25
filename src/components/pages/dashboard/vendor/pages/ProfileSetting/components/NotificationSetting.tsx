// src/components/NotificationSetting.tsx
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, AlertTriangle, FileText, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { Controller } from "react-hook-form";
import { useNotification } from "@/hooks/useNotification";

export default function NotificationSetting() {
  const {
    control,
    handleSubmit,
    isDirty,
    isLoading,
    isSuccess,
    isError,
  } = useNotification();

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-chart-6" />
        <h2 className="text-2xl font-bold text-foreground">Notification Preferences</h2>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      </div>

      {/* Success/Error Messages */}
      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            ✅ Notification preferences updated successfully!
          </p>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            ❌ Failed to update notification preferences. Please try again.
          </p>
        </div>
      )}

      {/* Notification Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-background rounded-lg">
              <Mail className="w-5 h-5 text-chart-6" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Email Notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Receive inspection reminders via email
              </p>
            </div>
          </div>
          <Controller
            name="emailNotifications"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-chart-6"
              />
            )}
          />
        </div>

        {/* High Risk Alerts - CHANGED from highRiskAlert to riskAlerts */}
        <div className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-background rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">High Risk Alerts</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Instant notifications for high-risk suppliers
              </p>
            </div>
          </div>
          <Controller
            name="riskAlerts" // CHANGED from highRiskAlert to riskAlerts
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-chart-6"
              />
            )}
          />
        </div>

        {/* Contract Expiry Reminders */}
        <div className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Contract Expiry Reminders</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get notified 60 days before contract expires
              </p>
            </div>
          </div>
          <Controller
            name="contractReminders"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-chart-6"
              />
            )}
          />
        </div>

        {/* Compliance Updates - CHANGED from complianceUpdate to complianceUpdates */}
        <div className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Compliance Updates</h3>
              <p className="text-sm text-muted-foreground mt-1">
                NIS2 compliance status changes
              </p>
            </div>
          </div>
          <Controller
            name="complianceUpdates" // CHANGED from complianceUpdate to complianceUpdates
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-chart-6"
              />
            )}
          />
        </div>

        {/* Assessment Reminders */}
        <div className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue/10 rounded-lg">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Assessment Reminders</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Reminders for upcoming assessments
              </p>
            </div>
          </div>
          <Controller
            name="assessmentReminders"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-chart-6"
              />
            )}
          />
        </div>

        {/* New Message Alerts - CHANGED from newMessageAlert to messageAlerts */}
        <div className="flex items-start justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">New Message Alerts</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Notifications for new messages in chat
              </p>
            </div>
          </div>
          <Controller
            name="messageAlerts" // CHANGED from newMessageAlert to messageAlerts
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-chart-6"
              />
            )}
          />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button 
            type="submit"
            disabled={!isDirty || isLoading}
            className="bg-chart-6 hover:bg-chart-6/90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}