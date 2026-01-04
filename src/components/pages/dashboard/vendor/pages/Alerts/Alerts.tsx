/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow-restricted-names */
// components/notifications/NotificationsAlerts.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building2,
  Mail,
  Bell,
  CheckCheck,
  Trash2,
  EyeOff,
  RefreshCw,
  Send,
  MoreVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

// Import RTK Query hooks
import {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationsMutation,
  useClearAllNotificationsMutation,
  useGetUnreadNotificationCountQuery,
  type Notification,
} from "@/redux/features/notification/notification.api";
import {
  useGetReportsQuery,
  useSendReportMutation,
} from "@/redux/features/report/report.api";
import { undefined } from "zod/v3";


/* ---------------- TYPES ---------------- */

interface SupplierDetails {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  contractStartDate: string;
  contractEndDate: string;
  category: string;
  criticality: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  bivScore?: number;
}

interface NotificationWithSupplier extends Notification {
  supplier?: SupplierDetails;
}

/* ---------------- COMPONENT ---------------- */

export default function NotificationsAlerts() {
  const [searchTerm] = useState("");
  const [filterType] = useState<string>("ALL");
  const [filterPriority] = useState<string>("ALL");
  const [filterStatus] = useState<string>("ALL");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDetails | null>(null);
  const [page, setPage] = useState(1);

  // API Calls
  const {
    data: notificationsResponse,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery();
  console.log("notificationsResponse", notificationsResponse)
  const { data: stats, refetch: refetchStats } = useGetNotificationStatsQuery();
  console.log("notifications", stats)
  const { data: unreadCount, refetch: refetchUnreadCount } = useGetUnreadNotificationCountQuery();

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotifications] = useDeleteNotificationsMutation();
  const [clearAllNotifications] = useClearAllNotificationsMutation();
  const [sendReport] = useSendReportMutation();
const { data: reportsResponse } = useGetReportsQuery(undefined); // ✅ correct


  // Extract data
  const notifications = notificationsResponse?.data || [];
  const totalNotifications = notificationsResponse?.meta?.total || 0;
  const totalPages = notificationsResponse?.meta?.pages || 1;
  const reports = reportsResponse || [];

  // Filter notifications based on search
  const filteredNotifications = notifications.filter((notification: NotificationWithSupplier) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handle mark as read
  const handleMarkAsRead = async (notificationIds?: string[]) => {
    try {
      const payload = notificationIds
        ? { notificationIds }
        : { markAll: true };

      await markAsRead(payload).unwrap();


      refetchNotifications();
      refetchStats();
      refetchUnreadCount();
      setSelectedNotifications([]);
    } catch (error) {
      console.log(error)

    }
  };

  // Handle delete notifications
  const handleDeleteNotifications = async (notificationIds: string[]) => {
    try {
      await deleteNotifications({ notificationIds }).unwrap();



      refetchNotifications();
      refetchStats();
      refetchUnreadCount();
      setSelectedNotifications([]);
    } catch (error) {
      console.log(error)
    }
  };

  // Handle clear all
  const handleClearAll = async () => {
    try {
      await clearAllNotifications().unwrap();



      refetchNotifications();
      refetchStats();
      refetchUnreadCount();
    } catch (error) {
      console.log(error)

    }
  };

  // Handle send report
const handleSendReport = async (reportId: string, recipientEmail?: string) => {
  try {
    // Only include recipientEmail if it exists
    const payload: { reportId: string; recipientEmail?: string } = { reportId };
    if (recipientEmail) payload.recipientEmail = recipientEmail;

    await sendReport(payload).unwrap();

  } catch (error) {
    console.log(error);
  }
};

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id]
    );
  };

  // Select all on current page
  const selectAllOnPage = () => {
    const pageIds = filteredNotifications.map((n: { id: any; }) => n.id);
    setSelectedNotifications(prev => {
      const allSelected = pageIds.every((id: string) => prev.includes(id));
      return allSelected ? [] : pageIds;
    });
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case "MEDIUM":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "LOW":
        return <Bell className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-destructive text-destructive-foreground";
      case "MEDIUM":
        return "bg-orange-500 text-white";
      case "LOW":
        return "bg-blue-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get notification type badge
  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      "RISK_ALERT": { label: "Risk Alert", variant: "destructive" },
      "CONTRACT_EXPIRY": { label: "Contract", variant: "default" },
      "ASSESSMENT_DUE": { label: "Assessment", variant: "secondary" },
      "ASSESSMENT_SUBMITTED": { label: "Assessment", variant: "secondary" },
      "PROBLEM_REPORTED": { label: "Problem", variant: "destructive" },
      "PROBLEM_UPDATED": { label: "Problem", variant: "outline" },
      "PROBLEM_RESOLVED": { label: "Resolved", variant: "default" },
      "SYSTEM_ALERT": { label: "System", variant: "outline" },
      "PAYMENT_SUCCESS": { label: "Payment", variant: "default" },
      "PAYMENT_FAILED": { label: "Payment", variant: "destructive" },
      "REPORT_GENERATED": { label: "Report", variant: "secondary" },
      "INVITATION_SENT": { label: "Invitation", variant: "outline" },
      "INVITATION_ACCEPTED": { label: "Invitation", variant: "default" },
      "ASSESSMENT_APPROVED": { label: "Assessment", variant: "default" },
      "ASSESSMENT_REJECTED": { label: "Assessment", variant: "destructive" },
      "EVIDENCE_REQUESTED": { label: "Evidence", variant: "secondary" },
      "EVIDENCE_APPROVED": { label: "Evidence", variant: "default" },
      "EVIDENCE_REJECTED": { label: "Evidence", variant: "destructive" },
      "CONTRACT_EXPIRING_SOON": { label: "Contract", variant: "default" },
      "SLA_BREACHED": { label: "SLA", variant: "destructive" },
    };

    const config = typeMap[type] || { label: type, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Loading state
  if (isLoadingNotifications) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Notifications & Alerts</h2>
            <p className="text-sm text-muted-foreground mt-1">Loading...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications & Alerts
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {totalNotifications} total notifications • {unreadCount?.count || 0} unread
          </p>
        </div>
 
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMarkAsRead()}
            disabled={totalNotifications === 0}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={totalNotifications === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={refetchNotifications}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

  
      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No notifications found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || filterType !== "ALL" || filterPriority !== "ALL" || filterStatus !== "ALL"
                  ? "Try changing your filters or search term"
                  : "All caught up! No notifications at the moment."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredNotifications.length} of {totalNotifications} notifications
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllOnPage}
              >
                {selectedNotifications.length === filteredNotifications.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            {filteredNotifications.map((notification: NotificationWithSupplier) => (
              <Card
                key={notification.id}
                className={`shadow-sm hover:shadow-md transition ${selectedNotifications.includes(notification.id) ? "border-primary" : ""
                  } ${!notification.isRead ? "border-l-4 border-l-primary" : ""}`}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      {/* Selection Checkbox */}
                      <Input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleSelection(notification.id)}
                        className="mt-1 w-4 h-4"
                      />

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-full border flex items-center justify-center">
                        {getPriorityIcon(notification.priority)}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                          {getTypeBadge(notification.type)}
                        </div>

                        <p className="text-muted-foreground mt-1">
                          {notification.message}
                        </p>

                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {Object.entries(notification.metadata).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                <strong>{key}:</strong> {String(value)}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Supplier Info if available */}
                        {notification.supplier && (
                          <div className="mt-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{notification.supplier.name}</span>
                            {notification.supplier.riskLevel && (
                              <Badge variant={notification.supplier.riskLevel === "HIGH" ? "destructive" : "secondary"}>
                                {notification.supplier.riskLevel} Risk
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex gap-3 text-sm text-muted-foreground mt-2">
                          <span>
                            {format(new Date(notification.createdAt), "MMM dd, yyyy • hh:mm a")}
                          </span>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <span>•</span>
                          <span>
                            {notification.isRead ? "Read" : "Unread"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-start gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead([notification.id])}
                          title="Mark as read"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {notification.type === "REPORT_GENERATED" && notification.metadata?.reportId && (
                            <DropdownMenuItem onClick={() => handleSendReport(notification.metadata.reportId)}>
                              <Send className="w-4 h-4 mr-2" />
                              Send Report
                            </DropdownMenuItem>
                          )}
                          {notification.supplier && (
                            <DropdownMenuItem onClick={() => setSelectedSupplier(notification.supplier!)}>
                              <Building2 className="w-4 h-4 mr-2" />
                              View Supplier
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleMarkAsRead([notification.id])}>
                            {notification.isRead ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Mark as Unread
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark as Read
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteNotifications([notification.id])}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent Reports Section */}
      {reports.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.slice(0, 3).map((report: any) => (
              <Card key={report.id} className="hover:shadow-md transition">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold line-clamp-1">{report.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {report.reportType.replace(/_/g, " ")}
                      </p>
                    </div>
                    <Badge variant="outline">{report.status}</Badge>
                  </div>
                  <p className="text-sm mt-2 line-clamp-2">{report.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(report.createdAt), "MMM dd, yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendReport(report.id)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Supplier Details Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div style={{ display: 'none' }}>
            <Button ref={null}>Open Supplier</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Building2 className="w-7 h-7" />
              {selectedSupplier?.name}
            </DialogTitle>
            <DialogDescription>
              Supplier details and contact information
            </DialogDescription>
          </DialogHeader>

       

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedSupplier(null)}>
              Close
            </Button>
            {selectedSupplier?.email && (
              <Button onClick={() => window.open(`mailto:${selectedSupplier.email}`, '_blank')}>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
