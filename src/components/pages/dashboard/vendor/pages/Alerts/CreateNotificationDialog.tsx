/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/notifications/CreateNotificationDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  Send,
  AlertTriangle,
  AlertCircle,
  Building2,
  UserCheck,
  Clock,
} from "lucide-react";
import { useCreateNotificationMutation, useGetTargetUsersQuery } from "@/redux/features/notification/notification.api";
import { toast } from "sonner";
import { format } from "date-fns";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getPlanFeatures } from "@/lib/planFeatures";

interface Props {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function CreateNotificationDialog({ trigger, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("SYSTEM_ALERT");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const { data: res, isLoading } = useGetTargetUsersQuery(undefined, { skip: !open });
  const targets = res?.data || [];
  const { data: userData } = useUserInfoQuery(undefined)
  const recipient = targets.find((t: any) => t.id === userId);
  const plan = userData?.data?.subscription;

  const permissions = getPlanFeatures(plan);
  const [create, { isLoading: sending }] = useCreateNotificationMutation();
  const sendersId = userData?.data?.id;
  const supplierId = userData?.data?.supplierProfile?.id;
  console.log('userId', userData)
  // Auto-title
  useEffect(() => {
    if (!title) {
      const titles = {
        SYSTEM_ALERT: "System Update",
        RISK_ALERT: "Risk Alert",
        CONTRACT_EXPIRING_SOON: "Contract Expiring Soon",
        CONTRACT_EXPIRY: "Contract Expired",
        ASSESSMENT_DUE: "Assessment Due",
        REPORT_GENERATED: "Report Ready",
        SLA_BREACHED: "SLA Breach",
        PAYMENT_FAILED: "Payment Failed",
      };
      setTitle(titles[type as keyof typeof titles] || "Notification");
    }
  }, [type, title]);

  // Auto-message
  useEffect(() => {
    if (!message && recipient) {
      const msgs = {
        SYSTEM_ALERT: `Hi ${recipient.name},\n\nAn important update is available in your dashboard.`,
        RISK_ALERT: `Hi ${recipient.name},\n\nA risk issue was detected. Please review and act promptly.`,
        CONTRACT_EXPIRING_SOON: `Hi ${recipient.name},\n\nYour contract is expiring soon. Please plan renewal.`,
        CONTRACT_EXPIRY: `Hi ${recipient.name},\n\nYour contract has expired. Contact us to continue service.`,
        ASSESSMENT_DUE: `Hi ${recipient.name},\n\nA new assessment is due. Please complete it soon.`,
        REPORT_GENERATED: `Hi ${recipient.name},\n\nYour latest report is ready for review!`,
        SLA_BREACHED: `URGENT: ${recipient.name},\n\nAn SLA breach occurred. Immediate action needed.`,
        PAYMENT_FAILED: `Hi ${recipient.name},\n\nPayment failed. Please update your payment method.`,
      };
      setMessage(msgs[type as keyof typeof msgs] || "Important message for you.");
    }
  }, [type, recipient, message]);

  const handleSend = async () => {
    if (!userId || !title.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await create({
        receiverId: userId,
        title: title.trim(),
        message: message.trim(),
        type,
        priority,
        metadata: {
          targetName: recipient.name,
          targetEmail: recipient.email,
          targetRole: recipient.role,
          senderUserId: sendersId,
          supplierId: supplierId
        },
      }).unwrap();

      toast.success(`Sent to ${recipient.name}!`);
      setOpen(false);
      setUserId("");
      setTitle("");
      setMessage("");
      onSuccess?.();
    } catch {
      toast.error("Failed to send");
    }
  };

  const getPriorityIcon = () => {
    if (priority === "HIGH") return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (priority === "MEDIUM") return <AlertCircle className="w-5 h-5 text-orange-600" />;
    return <Bell className="w-5 h-5 text-blue-600" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Notification
          </DialogTitle>
          <p>Your Limit : {permissions.notificationsSend} </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipient */}
          <div className="space-y-2">
            <Label>Recipient *</Label>
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            ) : targets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No available recipients</p>
            ) : (
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose recipient" />
                </SelectTrigger>
                <SelectContent>
                  {targets.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-3">
                        {t.role === "VENDOR" ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.email}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SYSTEM_ALERT">System Alert</SelectItem>
                  <SelectItem value="RISK_ALERT">Risk Alert</SelectItem>
                  <SelectItem value="CONTRACT_EXPIRING_SOON">Contract Expiring</SelectItem>
                  <SelectItem value="CONTRACT_EXPIRY">Contract Expired</SelectItem>
                  <SelectItem value="ASSESSMENT_DUE">Assessment Due</SelectItem>
                  <SelectItem value="REPORT_GENERATED">Report Ready</SelectItem>
                  <SelectItem value="SLA_BREACHED">SLA Breach</SelectItem>
                  <SelectItem value="PAYMENT_FAILED">Payment Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Write your message..."
            />
          </div>

          {/* Preview */}
          {recipient && (
            <Card className="border-l-4 border-primary bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  {getPriorityIcon()}
                  <div>
                    <div className="font-semibold">{title}</div>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {message}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      To: {recipient.name} • {format(new Date(), "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}