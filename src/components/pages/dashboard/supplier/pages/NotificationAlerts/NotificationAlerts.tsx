// src/components/pages/dashboard/supplier/NotificationsAlerts.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { format } from "date-fns";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

interface Alert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  date: string;
  resolved?: boolean;
}

const alerts: Alert[] = [
  { id: "1", type: "error", title: "Document Expired", message: "Security Certificate expired 5 days ago", date: "2025-02-12" },
  { id: "2", type: "warning", title: "Evidence Required", message: "Data Security Assessment requires 3 more documents", date: "2025-02-12" },
  { id: "3", type: "error", title: "High Risk Detected", message: "Access Control score below threshold (45%)", date: "2025-02-13" },
  { id: "4", type: "warning", title: "Assessment Deadline", message: "Risk Management Assessment due in 3 days", date: "2025-02-14" },
  { id: "5", type: "success", title: "Score Improved", message: "Your overall compliance score increased to 82%", date: "2025-01-08", resolved: true },
  { id: "6", type: "success", title: "Document Approved", message: "ISO 27001 Certificate has been approved", date: "2025-02-10", resolved: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case "error": return <AlertCircle className="w-5 h-5 text-destructive shrink-0" />;
    case "warning": return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
    case "info": return <Info  className="w-5 h-5 text-blue-600 shrink-0" />;
    case "success": return <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />;
    default: return null;
  }
};

const AlertCard = ({ alert }: { alert: Alert }) => (

  <Card className="border shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Icon */}
        <div className="mt-1">{getIcon(alert.type)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-base sm:text-lg">{alert.title}</h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none">
            {alert.message}
          </p>

          {/* Buttons */}
          <div className=" flex-row lg:flex flex-wrap gap-2 mt-4">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              View Details
            </Button>
            {!alert.resolved && (
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>

        {/* Date + Resolved Badge */}
        <div className="text-right ml-auto sm:ml-0">
          <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {format(new Date(alert.date), "MMM dd, yyyy")}
          </p>
          {alert.resolved && (
            <Badge variant="secondary" className="mt-2 text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Resolved
            </Badge>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function NotificationsAlertsPage() {
  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);
   const {data } = useUserInfoQuery(undefined);
   const supplyerAlert = data?.data?.vendor?.supplierProblems ;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className=" mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Notifications & Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeAlerts.length} unread alert{activeAlerts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs defaultValue="all" className="w-full">
          {/* Tabs Header – Full width on mobile, compact on desktop */}
          <TabsList className="grid w-full grid-cols-3 mb-6 ">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All Alerts</TabsTrigger>
            <TabsTrigger value="active" className="text-xs sm:text-sm">
              Active ({activeAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs sm:text-sm">
              Resolved ({resolvedAlerts.length})
            </TabsTrigger>
          </TabsList>

          {/* All Alerts */}
          <TabsContent value="all" className="mt-4 space-y-4">
            {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
          </TabsContent>

          {/* Active Only */}
          <TabsContent value="active" className="mt-4 space-y-4">
            {activeAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
          </TabsContent>

          {/* Resolved Only */}
          <TabsContent value="resolved" className="mt-4 space-y-4">
            {resolvedAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}