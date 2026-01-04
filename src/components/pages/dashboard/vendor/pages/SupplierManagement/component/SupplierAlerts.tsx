/* eslint-disable @typescript-eslint/no-explicit-any */
// components/supplier/SupplierAlerts.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface Alert {
  id: string;
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "RESOLVED" | "IN_PROGRESS";
  createdAt: string;
}

interface SupplierAlertsProps {
  data?: {
    data?: {
      vendor?: {
        supplierProblems?: Alert[];
      };
    };
  };
}

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return {
        badge: "destructive",
        icon: AlertCircle,
        color: "text-red-600",
        bg: "bg-red-100 dark:bg-red-900/20",
        label: "High Priority",
      };
    case "MEDIUM":
      return {
        badge: "default",
        icon: AlertTriangle,
        color: "text-amber-600",
        bg: "bg-amber-100 dark:bg-amber-900/20",
        label: "Medium Priority",
      };
    case "LOW":
      return {
        badge: "secondary",
        icon: Clock,
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/20",
        label: "Low Priority",
      };
    default:
      return {
        badge: "secondary",
        icon: Clock,
        color: "text-muted-foreground",
        bg: "bg-muted",
        label: priority,
      };
  }
};

export default function SupplierAlerts({ data }: SupplierAlertsProps) {
  const alerts: Alert[] = data?.data?.vendor?.supplierProblems || [];

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            Supplier Alerts
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            No active alerts from this supplier
          </p>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-muted-foreground">All good! No issues reported.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Supplier Alerts</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {alerts.length} active alert{alerts.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Badge variant="destructive" className="text-sm">
            {alerts.filter(a => a.status === "OPEN").length} alert
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const priority = getPriorityConfig(alert.priority);
          const Icon = priority.icon;

          return (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-5 rounded-xl border bg-card hover:bg-muted/40 transition-all duration-200"
            >
              {/* Priority Icon */}
              <div className={`shrink-0 w-12 h-12 rounded-full ${priority.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${priority.color}`} />
              </div>

              {/* Alert Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <h4 className="font-semibold text-foreground text-base">
                    {alert.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={priority.badge as any}>
                      {priority.label}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {alert.description}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-w-3 h-3" />
                    {format(new Date(alert.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}