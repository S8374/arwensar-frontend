// src/modules/report/components/ReportsStatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Shield, TrendingUp, Users, AlertTriangle, FileText } from "lucide-react";
import { useGetReportStatisticsQuery } from "@/redux/features/report/report.api";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsStatsCards() {
  const { data: stats, isLoading, error } = useGetReportStatisticsQuery();

  if (isLoading) {
    return <StatsCardsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-red-600">Failed to load statistics</p>
      </div>
    );
  }

  const statistics = stats?.data || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Reports */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-3xl font-bold mt-2">
                {statistics.totalReports || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {statistics.byType ? Object.keys(statistics.byType).length : 0} types
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Assessments */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Risk Suppliers</p>
              <p className="text-3xl font-bold mt-2">
                {statistics.summary?.highRiskSuppliers || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                of {statistics.summary?.totalSuppliers || 0} total
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Problems */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Problems</p>
              <p className="text-3xl font-bold mt-2">
                {statistics.summary?.openProblems || 0}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                {statistics.summary?.recentProblems || 0} recent
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Count */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Suppliers</p>
              <p className="text-3xl font-bold mt-2">
                {statistics.summary?.totalSuppliers || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {statistics.summary?.activeSuppliers || 0} active
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average BIV Score</p>
              <p className="text-3xl font-bold mt-2">
                {statistics.summary?.averageBIVScore?.toFixed(1) || "0.0"}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Overall compliance rate
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assessments */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Assessments</p>
              <p className="text-3xl font-bold mt-2">
                {statistics.summary?.upcomingAssessments || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {statistics.summary?.overdueAssessments || 0} overdue
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}