
import { useState } from "react";
import { BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const initialNotifications = [
  {
    id: 1,
    user: "Chris Tompson",
    action: "requested review on",
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
  },
  {
    id: 2,
    user: "Emma Davis",
    action: "shared",
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
  },
  {
    id: 3,
    user: "James Wilson",
    action: "assigned you to",
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
  },
];

function Dot() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const readNotification = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellIcon size={16} />

          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>

          {unreadCount > 0 && (
            <button className="text-xs text-muted-foreground hover:underline"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="-mx-1 my-1 h-px bg-border" />

        {notifications.map((n) => (
          <div
            key={n.id}
            className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors cursor-pointer"
            onClick={() => readNotification(n.id)}
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <div className="text-left text-foreground/80">
                  <span className="font-medium">{n.user}</span>{" "}
                  {n.action}{" "}
                  <span className="font-medium">{n.target}</span>.
                </div>

                <div className="text-xs text-muted-foreground">
                  {n.timestamp}
                </div>
              </div>

              {n.unread && (
                <div className="absolute end-0 self-center">
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
