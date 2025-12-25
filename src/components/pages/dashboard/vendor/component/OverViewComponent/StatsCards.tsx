import { Card } from "@/components/ui/card";
import { getIconComponent } from "@/lib/icon-maper";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  FileCheck,
  AlertTriangle,
  FileWarning,
  Clock,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCards() {
  // MOCK DATA
  const stats = {
    quickStats: {
      totalSuppliers: 24,
      documentComplianceRate: 85,
    },
    nis2Compliance: {
      currentScore: 92.5,
      changePercentage: 1.2,
      trend: "UP",
      breakdown: {
        documentCompliance: { score: 80 },
      },
      improvementToday: 0.5,
    },
    assessmentProgress: {
      pending: 5,
      averageScore: 78,
    },
    riskTrends: {
      highRiskSuppliers: {
        current: 3,
        change: 1,
        trend: "UP",
      },
    },
    supplierProblems: {
      pending: 2,
      highPriority: 1,
    },
    timeline: {
      today: { newAssessments: 2 },
      thisMonth: { contractsExpiring: 1 },
    },
    contractManagement: {
      expiringContracts: 2,
    },
  };

  const statsData = [
    {
      title: "Total Suppliers",
      value: stats.quickStats.totalSuppliers.toString(),
      icon: "users",
      change: `${stats.riskTrends.highRiskSuppliers.change}`,
      changeType: stats.riskTrends.highRiskSuppliers.change > 0 ? "negative" : "positive",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "NIS2 Compliance Score",
      value: `${stats.nis2Compliance.currentScore.toFixed(1)}%`,
      icon: "shield-check",
      change: `${stats.nis2Compliance.changePercentage > 0 ? '+' : ''}${stats.nis2Compliance.changePercentage.toFixed(1)}%`,
      changeType: stats.nis2Compliance.trend === "UP" ? "positive" : "negative",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Pending Assessments",
      value: stats.assessmentProgress.pending.toString(),
      icon: "clock",
      change: `${stats.timeline.today.newAssessments} today`,
      changeType: stats.timeline.today.newAssessments > 0 ? "negative" : "neutral",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "High Risk Suppliers",
      value: stats.riskTrends.highRiskSuppliers.current.toString(),
      icon: "alert-triangle",
      change: `${stats.riskTrends.highRiskSuppliers.change > 0 ? '+' : ''}${stats.riskTrends.highRiskSuppliers.change}`,
      changeType: stats.riskTrends.highRiskSuppliers.trend === "UP" ? "negative" : "positive",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Document Compliance",
      value: `${stats.quickStats.documentComplianceRate}%`,
      icon: "file-check",
      change: `${stats.nis2Compliance.breakdown.documentCompliance.score}% target`,
      changeType:
        stats.quickStats.documentComplianceRate >= stats.nis2Compliance.breakdown.documentCompliance.score
          ? "positive"
          : "negative",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Active Problems",
      value: stats.supplierProblems.pending.toString(),
      icon: "file-warning",
      change: `${stats.supplierProblems.highPriority} high priority`,
      changeType: stats.supplierProblems.highPriority > 0 ? "negative" : "neutral",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Average Score",
      value: `${stats.assessmentProgress.averageScore}%`,
      icon: "trending-up",
      change: `${stats.nis2Compliance.improvementToday > 0 ? '+' : ''}${stats.nis2Compliance.improvementToday.toFixed(1)}% today`,
      changeType: stats.nis2Compliance.improvementToday > 0 ? "positive" : "negative",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Expiring Contracts",
      value: stats.contractManagement.expiringContracts.toString(),
      icon: "calendar",
      change: `${stats.timeline.thisMonth.contractsExpiring} this month`,
      changeType: stats.timeline.thisMonth.contractsExpiring > 0 ? "negative" : "neutral",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statsData.map((item, i) => {
        const Icon = getIconComponent(item.icon);

        const getChangeIcon = () => {
          if (item.changeType === "positive") return <TrendingUp className="w-3 h-3" />;
          if (item.changeType === "negative") return <TrendingDown className="w-3 h-3" />;
          return <Minus className="w-3 h-3" />;
        };

        return (
          <Card key={i} className="p-4 sm:p-6 bg-background border shadow-sm hover:shadow-md transition-shadow duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1">{item.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground truncate">{item.value}</p>

                {item.change && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      item.changeType === "positive"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : item.changeType === "negative"
                        ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}>
                      {getChangeIcon()}
                      <span>{item.change}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bgColor} flex-shrink-0 ml-3 transition-transform duration-200 group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Skeleton placeholder
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Error state placeholder
export function ErrorState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4 sm:p-6 border-dashed border-2">
          <div className="text-center py-4">
            <Users className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load stats</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
