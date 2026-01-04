/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/vendor/tabs/PerformanceTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  LogIn,
  LogOut,
  UserCheck,
  ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import { useGetMyActivityQuery } from "@/redux/features/activity/activity.api";

type Props = {
  supplier: any;
  progress: any;
};

export default function PerformanceTab({  }: Props) {
  const { data: activityData, isLoading: isLoadingActivity } = useGetMyActivityQuery(undefined);
  const activities = activityData?.data || [];



  // Map action to icon and color
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "LOGIN": return <LogIn className="w-4 h-4" />;
      case "LOGOUT": return <LogOut className="w-4 h-4" />;
      case "ASSESSMENT_SUBMITTED": return <FileText className="w-4 h-4" />;
      case "ASSESSMENT_APPROVED": return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "ASSESSMENT_REJECTED": return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "PROFILE_UPDATE": return <UserCheck className="w-4 h-4" />;
      default: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case "LOGIN": return "text-blue-600";
      case "LOGOUT": return "text-gray-600";
      case "ASSESSMENT_APPROVED": return "text-emerald-600";
      case "ASSESSMENT_REJECTED": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      {/* Performance Stats */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
        
      </div>

      {/* Activity Log */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <Card className="h-96">
          <CardContent className="p-0 h-full">
            {isLoadingActivity ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading activity...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <ShieldCheck className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">No activity yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Activity will appear here when you log in, submit assessments, or update your profile.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  {activities.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-full bg-background ${getActivityColor(activity.action)}`}>
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {activity.action.replace(/_/g, " ")}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                          </span>
                        </div>
                        {activity.ipAddress && (
                          <p className="text-xs text-muted-foreground mt-1">
                            From IP: {activity.ipAddress}
                          </p>
                        )}
                        {activity.details && (
                          <div className="text-xs text-muted-foreground mt-2 space-y-1">
                            {Object.entries(activity.details).map(([key, value]) => (
                              <div key={key}>
                                <strong className="capitalize">{key}:</strong> {String(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}