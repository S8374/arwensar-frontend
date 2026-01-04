/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/vendor/component/OverViewComponent/StatsCards.tsx
import { Card } from "@/components/ui/card";
import { getIconComponent } from "@/lib/icon-maper";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsProps {
  stats?: any; // Made optional and safe
}

export default function StatsCards({ stats }: StatsProps) {
  // Safe access with fallbacks
  const s = stats || {};

  const statsData = [
    {
      title: "Total Suppliers",
      value: s.supplierStats?.totalSuppliers ?? 0,
      change: s.supplierStats?.recentAdditions ?? 0,
      changeText: `${s.supplierStats?.recentAdditions ?? 0} new this month`,
      changeType: (s.supplierStats?.recentAdditions ?? 0) > 0 ? "positive" : "neutral",
      icon: "users",
      colors: {
        gradient: "from-blue-400/20 to-cyan-400/20",
        border: "border-blue-200 dark:border-blue-700",
        icon: "text-blue-600 dark:text-blue-400",
        ring: "ring-blue-500/20"
      }
    },
    {
      title: "NIS2 Compliance",
      value: (s.nis2Compliance?.overallScore ?? 0).toFixed(1),
      change: s.nis2Compliance?.todayImprovement ?? 0,
      changeText: s.nis2Compliance?.trend === "UP" 
        ? `+${Math.abs(s.nis2Compliance?.todayImprovement ?? 0).toFixed(1)}% today`
        : `-${Math.abs(s.nis2Compliance?.todayImprovement ?? 0).toFixed(1)}% today`,
      changeType: s.nis2Compliance?.trend === "UP" ? "positive" : "negative",
      icon: "shield-check",
      colors: {
        gradient: "from-emerald-400/20 to-teal-400/20",
        border: "border-emerald-200 dark:border-emerald-700",
        icon: "text-emerald-600 dark:text-emerald-400",
        ring: "ring-emerald-500/20"
      }
    },
    {
      title: "Pending Assessments",
      value: s.assessmentStats?.pendingAssessments ?? 0,
      change: s.assessmentStats?.overdueAssessments ?? 0,
      changeText: `${s.assessmentStats?.overdueAssessments ?? 0} overdue`,
      changeType: (s.assessmentStats?.overdueAssessments ?? 0) > 0 ? "negative" : "neutral",
      icon: "clock",
      colors: {
        gradient: "from-amber-400/20 to-orange-400/20",
        border: "border-amber-200 dark:border-amber-700",
        icon: "text-amber-600 dark:text-amber-400",
        ring: "ring-amber-500/20"
      }
    },
    {
      title: "Critical Problems",
      value: s.problemStats?.criticalProblems ?? 0,
      change: s.problemStats?.problemsByPriority?.urgent ?? 0,
      changeText: `${s.problemStats?.problemsByPriority?.urgent ?? 0} urgent`,
      changeType: (s.problemStats?.criticalProblems ?? 0) > 0 ? "negative" : "neutral",
      icon: "alert-triangle",
      colors: {
        gradient: "from-red-400/20 to-rose-400/20",
        border: "border-red-200 dark:border-red-700",
        icon: "text-red-600 dark:text-red-400",
        ring: "ring-red-500/20"
      }
    },
    {
      title: "Active Contracts",
      value: s.contractStats?.contractsByStatus?.active ?? 0,
      change: s.contractStats?.expiringContracts ?? 0,
      changeText: `${s.contractStats?.expiringContracts ?? 0} expiring soon`,
      changeType: (s.contractStats?.expiringContracts ?? 0) > 0 ? "negative" : "neutral",
      icon: "file-check",
      colors: {
        gradient: "from-purple-400/20 to-pink-400/20",
        border: "border-purple-200 dark:border-purple-700",
        icon: "text-purple-600 dark:text-purple-400",
        ring: "ring-purple-500/20"
      }
    },
    {
      title: "On-Time Delivery",
      value: s.additionalStats?.performanceStats?.onTimeDeliveryRate ?? 0,
      changeText: "Last 30 days average",
      changeType: "positive",
      icon: "trending-up",
      colors: {
        gradient: "from-indigo-400/20 to-blue-400/20",
        border: "border-indigo-200 dark:border-indigo-700",
        icon: "text-indigo-600 dark:text-indigo-400",
        ring: "ring-indigo-500/20"
      }
    },
    {
      title: "Satisfaction Score",
      value: (s.additionalStats?.performanceStats?.satisfactionScore ?? 0).toFixed(1),
      changeText: "Out of 10.0",
      changeType: "positive",
      icon: "star",
      colors: {
        gradient: "from-yellow-400/20 to-amber-400/20",
        border: "border-yellow-200 dark:border-yellow-700",
        icon: "text-yellow-600 dark:text-yellow-400",
        ring: "ring-yellow-500/20"
      }
    },
    {
      title: "Recent Activities",
      value: s.additionalStats?.activityStats?.recentActivities ?? 0,
      changeText: "Last 7 days",
      changeType: "neutral",
      icon: "activity",
      colors: {
        gradient: "from-cyan-400/20 to-teal-400/20",
        border: "border-cyan-200 dark:border-cyan-700",
        icon: "text-cyan-600 dark:text-cyan-400",
        ring: "ring-cyan-500/20"
      }
    },
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "positive": return <TrendingUp className="w-4 h-4" />;
      case "negative": return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getChangeBadgeStyle = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
      case "negative":
        return "bg-red-100/80 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100/80 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-3 gap-5">
      {statsData.map((item, index) => {
        const Icon = getIconComponent(item.icon);
        return (
          <Card
            key={index}
            className={`
              relative overflow-hidden group
              bg-linear-to-br ${item.colors.gradient}
              border ${item.colors.border}
              hover:shadow-2xl hover:shadow-${item.colors.icon.split('-')[1]}-500/20
              transition-all duration-500 hover:scale-105 hover:-translate-y-2
              backdrop-blur-sm
            `}
          >
            {/* Subtle ring effect on hover */}
            <div className={`absolute inset-0 ring-4 ring-transparent group-hover:ring-${item.colors.ring} transition-all duration-500 opacity-0 group-hover:opacity-100`} />
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    {item.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {item.value}{item.title.includes("Score") || item.title.includes("Delivery") ? "" : ""}
                    {item.title.includes("Compliance") || item.title.includes("Delivery") ? "%" : ""}
                  </p>
                </div>
                
                <div className={`
                  p-3 rounded-2xl ${item.colors.icon}
                  bg-white/70 dark:bg-gray-800/60
                  backdrop-blur-md ring-1 ring-white/20
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              {item.changeText && (
                <div className={`
                  flex items-center gap-2 text-xs font-medium
                  px-3 py-2 rounded-xl w-fit
                  ${getChangeBadgeStyle(item.changeType)}
                  backdrop-blur-sm
                `}>
                  {getChangeIcon(item.changeType)}
                  <span>{item.changeText}</span>
                </div>
              )}
            </div>

            {/* Bottom shine effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </Card>
        );
      })}
    </div>
  );
}

// Loading Skeleton
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-5">
      {Array(8).fill(0).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
          <Skeleton className="h-8 w-32 rounded-xl" />
        </Card>
      ))}
    </div>
  );
}