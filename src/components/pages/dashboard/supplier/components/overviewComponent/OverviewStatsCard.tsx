// src/components/pages/dashboard/supplier/components/overviewComponent/OverviewStatsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowUpRight, ChartColumn, FileText } from "lucide-react";
import StatCard from "../card/StatCard";

export default function OverviewStatsCard() {
  const complianceScore = 78;
  const scoreTrend = "+12%";

  const stats = [
    { 
      label: "Assessments Pending", 
      value: 5, 
      icon: FileText, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      badge: "Assessments Pending" 
    },
    { 
      label: "Documents Expiring Soon", 
      value: 5, 
      icon: AlertCircle, 
      color: "text-red-600", 
      bg: "bg-red-50", 
      badge: "Action Required" 
    }
    // { 
    //   label: "Vendor Messages", 
    //   value: 50, 
    //   icon: MessageSquare, 
    //   color: "text-purple-600", 
    //   bg: "bg-purple-50", 
    //   badge: "New Request" 
    // },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Compliance Score Card */}
      <Card className="bg-background border sm:col-span-2 lg:col-span-1">
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-foreground font-medium">Overall Compliance Score</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-1 sm:mt-2">{complianceScore}%</p>
              <p className="text-xs text-foreground flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {scoreTrend} improvement
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/80 rounded-full flex items-center justify-center ml-4">
              <ChartColumn className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Stats */}
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}