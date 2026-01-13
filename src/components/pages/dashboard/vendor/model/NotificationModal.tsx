// components/ui/NotificationBell.tsx
import { useState } from "react";
import { Bell, CheckCheck, Trash2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useClearAllNotificationsMutation,
} from "@/redux/features/notification/notification.api";
import { formatDistanceToNow } from "date-fns";
interface Notification {
  id: string;
  title: string;
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  type?: string;
  isRead: boolean;
  createdAt: string;
}

function Dot() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" className="text-primary">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}

function getPriorityIcon(priority: "LOW" | "MEDIUM" | "HIGH") {
  switch (priority) {
    case "HIGH":
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case "MEDIUM":
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case "LOW":
    default:
      return <Info className="w-4 h-4 text-blue-500" />;
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  // Fetch notifications and unread count
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: open ? 100 : 0, // Poll every 30s when popover is open
  });

  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 60000, // Update badge every minute
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [clearAll] = useClearAllNotificationsMutation();

  const notifications: Notification[] = notificationsData?.data || [];

const unreadCount: number = unreadData?.data?.count ?? 0;

  const handleMarkAllAsRead = async () => {
    try {
      await markAsRead({ markAll: true }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleMarkOneAsRead = async (id: string) => {
    try {
      await markAsRead({ notificationIds: [id] }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      try {
        await clearAll().unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to clear notifications", err);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={handleClearAll}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-muted-foreground">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 text-destructive" />
              <p className="text-sm">Failed to load notifications</p>
              <Button variant="ghost" size="sm" className="mt-3" onClick={refetch}>
                Retry
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm mt-2">No notifications at the moment.</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer group ${!notification.isRead ? "bg-primary/5" : ""
                    }`}
                  onClick={() => !notification.isRead && handleMarkOneAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getPriorityIcon(notification.priority)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </span>

                        {/* Type badge (optional) */}
                        {notification.type && (
                          <Badge variant="secondary" className="text-xs">
                            {notification.type.replace(/_/g, " ")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Unread dot */}
                    {!notification.isRead && (
                      <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dot />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}