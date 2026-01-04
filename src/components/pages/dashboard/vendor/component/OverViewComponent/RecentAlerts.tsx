// src/components/OverViewComponent/RecentAlerts.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bell, CheckCircle2 } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: string;         // e.g., "COMPLIANCE", "ASSESSMENT", "CONTRACT", "RISK"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
  supplier?: string;
  metadata?: any;
}

interface Props {
  alerts: Alert[];
}

export default function RecentAlerts({ alerts = [] }: Props) {
  const getPriorityBadge = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL":
        return <Badge variant="destructive">Critical</Badge>;
      case "HIGH":
        return <Badge className="bg-red-500 text-white">High</Badge>;
      case "MEDIUM":
        return <Badge className="bg-amber-500 text-white">Medium</Badge>;
      case "LOW":
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getIcon = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL":
      case "HIGH":
        return <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />;
      case "MEDIUM":
        return <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
      if (diffInHours < 48) return "Yesterday";
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3 py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-muted-foreground">No recent alerts</p>
            <p className="text-xs text-muted-foreground">Everything looks good!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className=" flex flex-col">
        <div className="space-y-3  overflow-y-auto max-h-[320px] pr-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors"
            >
              {getIcon(alert.priority)}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{alert.title}</p>
                    {alert.supplier && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.supplier}
                      </p>
                    )}
                  </div>
                  {getPriorityBadge(alert.priority)}
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {alert.message}
                </p>

                <p className="text-xs text-muted-foreground/70 mt-2">
                  {formatDate(alert.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {alerts.length > 4 && (
          <Button variant="link" className="w-full text-primary text-sm mt-4 shrink-0">
            View All Alerts →
          </Button>
        )}
      </CardContent>
    </Card>
  );
}