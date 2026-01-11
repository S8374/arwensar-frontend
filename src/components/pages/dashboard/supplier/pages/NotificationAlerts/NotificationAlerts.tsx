/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useGetUnreadNotificationCountQuery,
} from "@/redux/features/notification/notification.api";
import CreateNotificationDialog from "../../../vendor/pages/Alerts/CreateNotificationDialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

const getIcon = (type: string) => {
  switch (type) {
    case "error":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    case "success":
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    default:
      return <Info className="w-5 h-5 text-blue-600" />;
  }
};

const NotificationCard = ({
  notification,
  onMarkAsRead
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) => {
  const [marking, setMarking] = useState(false);

  const handleMarkRead = async () => {
    setMarking(true);
    try {
      await onMarkAsRead(notification.id);
    } catch {
      toast.error("Failed to mark as read");
    } finally {
      setMarking(false);
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${!notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div className="mt-1 flex-shrink-0">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!notification.isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkRead}
                  disabled={marking}
                  className="text-xs"
                >
                  {marking ? "..." : "Mark as read"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function NotificationsAlertsPage() {
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // Refresh every 30 seconds
  });

  const { data: unreadCountData } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 60000,
  });
  console.log("notificationsData", notificationsData);
  const [markAsRead] = useMarkNotificationAsReadMutation();
  console.log("unreadCountData",unreadCountData)
  const notifications: Notification[] = notificationsData?.data || [];
  const unreadCount : number = unreadCountData?.data?.count || 0; // always a number


  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({ notificationIds: [notificationId] }).unwrap();
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markAsRead({ markAll: true }).unwrap();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-8 w-48" />
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load notifications</h2>
        <Button onClick={() => refetch()}>Try Again</Button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Notifications</h1>
              <CreateNotificationDialog />
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark all as read
              </Button>

            )}
          </div>
          <p className="text-muted-foreground">
            You have{" "}
            <span className="font-semibold text-primary">{unreadCount}</span>{" "}
            unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            {/* <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger> */}
            <TabsTrigger value="read">
              Read ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No notifications yet</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {unreadNotifications.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              unreadNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {readNotifications.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-lg text-muted-foreground">No read notifications</p>
                </CardContent>
              </Card>
            ) : (
              readNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => { }}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}