import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Alert {
  id: number;
  supplier: string;
  message: string;
  level: string;
}

interface Props {
  alerts: Alert[];
}

export default function RecentAlerts({ alerts }: Props) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto max-h-[300px]">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-background border">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-chart-1 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{alert.supplier}</p>
                  <Badge variant="destructive" className="text-xs whitespace-nowrap">High</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="link" className="w-full text-primary pl-0 text-sm mt-4 shrink-0">
          View All Alerts →
        </Button>
      </CardContent>
    </Card>
  );
}