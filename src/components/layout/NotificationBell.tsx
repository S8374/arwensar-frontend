// src/components/layout/NotificationBell.tsx
import { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
} from "@/redux/features/notification/notification.api";

import { Skeleton } from "@/components/ui/skeleton";
import { formatNotificationDate, getActionFromNotification, getNotificationColor, getNotificationIcon, getNotificationTypeLabel } from "@/lib/notification.helper";

const NotificationItem = ({ notification }: { notification: any }) => {
  const navigate = useNavigate();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);
  const action = getActionFromNotification(notification);

  const handleClick = async () => {
    if (!notification.isRead) {
      await markAsRead({ notificationIds: [notification.id] });
    }
    
    if (action) {
      navigate(action.path);
    }
  };

  return (
    <DropdownMenuItem
      className="flex flex-col items-start p-3 cursor-pointer hover:bg-muted"
      onClick={handleClick}
    >
      <div className="flex items-start w-full">
        <div className={`mt-1 mr-3 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className="font-medium text-sm truncate">{notification.title}</p>
            <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
              {formatNotificationDate(notification.createdAt)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <Badge variant="outline" className="mt-2 text-xs">
            {getNotificationTypeLabel(notification.type)}
          </Badge>
        </div>
        {!notification.isRead && (
          <div className="ml-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
        )}
      </div>
    </DropdownMenuItem>
  );
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notificationsData, isLoading } = useGetNotificationsQuery(
    { limit: 5, isRead: false },
    { skip: !isOpen }
  );
  const { data: unreadCountData, refetch } = useGetUnreadNotificationCountQuery();
  const navigate = useNavigate();


  const unreadCount = unreadCountData?.count || 0;
  const notifications = notificationsData?.data || [];

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  const handleMarkAllAsRead = async () => {
    try {
      // This would call the mark all as read mutation
      // await markAllAsRead().unwrap();
      console.log("Mark all as read");
      refetch();
    } catch (error) {
      
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => refetch()}
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* <ScrollArea className="h-72">
          <DropdownMenuGroup>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <DropdownMenuItem key={i} className="p-3">
                  <div className="flex items-start w-full">
                    <Skeleton className="h-4 w-4 rounded mr-3 mt-1" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <DropdownMenuItem className="p-6 text-center cursor-default">
                <div className="text-center w-full">
                  <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </ScrollArea> */}
        
        <DropdownMenuSeparator />
        <div className="p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm"
            onClick={handleViewAll}
          >
            View all notifications
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm mt-1"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}