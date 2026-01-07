/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/supplier/SupplierDashboard.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Clock,
  BarChart3,
  User,
  Shield,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileCheck,
  Phone,
  Mail,
  Target,
  Activity,
  Award,
  Clock3,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { useGetSupplierDashboardQuery } from "@/redux/features/supplyer/supplyer.api";
import ComplianceTable from "./components/overviewComponent/Compliancetable";
import { formatDistanceToNow, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupplierDashboard() {
  const { data: dashboardData, isLoading, refetch } = useGetSupplierDashboardQuery();

  // Handle loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Extract data with safe defaults
  const data = dashboardData?.data || {};

  // Supplier Information
  const supplierInfo = data.supplierInfo || {};

  // Contract Information
  const contractInfo = data.contractInfo || {};

  // Assessment Stats
  const assessmentStats = data.assessmentStats || {};
  const completed =
    assessmentStats.totalAssessments - assessmentStats.pendingAssessments;
  const progress =
    assessmentStats.totalAssessments === 0
      ? 0
      : Math.round(
        (completed / assessmentStats.totalAssessments) * 100
      );
  // Risk Stats
  const riskStats = data.riskStats || {};

  // Performance Stats
  const performanceStats = data.performanceStats || {};

  // Document Stats
  const documentStats = data.documentStats || {};

  // Problem Stats
  const problemStats = data.problemStats || {};

  // Recent Activity
  const recentActivity = data.recentActivity || {};

  // Upcoming Events
  const upcomingEvents = data.upcomingEvents || [];
  console.log("dashboardData", dashboardData)
  // Helper functions
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock3 className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'APPROVED':
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'DRAFT':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><FileText className="w-3 h-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate overall completion percentage
  const overallCompletion = assessmentStats.totalAssessments > 0
    ? Math.round((assessmentStats.completedAssessments / assessmentStats.totalAssessments) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Welcome back, {supplierInfo.contactPerson || "Supplier"} 👋
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Monitor your compliance progress, assessments, and contract status
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Target className="w-4 h-4 text-blue-600" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{overallCompletion}%</div>
            <Progress value={overallCompletion} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">
              {assessmentStats.completedAssessments} of {assessmentStats.totalAssessments} assessments completed
            </p>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card className="border-l-4 border-l-red-500 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              <Badge className={`${getRiskLevelColor(riskStats.riskLevel)} px-4 py-1.5 text-lg`}>
                {riskStats.riskLevel || "Not Assessed"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              BIV Score: {riskStats.bivScore?.toFixed(1) || "—"}
            </p>
          </CardContent>
        </Card>

        {/* Contract Status */}
        <Card className={`border-l-4 ${contractInfo.isExpiringSoon ? 'border-l-amber-500' : 'border-l-green-500'} shadow-lg`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <FileCheck className="w-4 h-4" />
              Contract Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {contractInfo.isExpired ? "Expired" : contractInfo.isExpiringSoon ? "Expiring" : "Active"}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Ends: {contractInfo.contractEndDate ? format(new Date(contractInfo.contractEndDate), 'MMM dd, yyyy') : "—"}
              </span>
              {contractInfo.daysUntilExpiry && (
                <Badge variant={contractInfo.daysUntilExpiry < 30 ? "destructive" : "outline"}>
                  {contractInfo.daysUntilExpiry} days left
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Score */}
        <Card className="border-l-4 border-l-emerald-500 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Award className="w-4 h-4 text-emerald-600" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{performanceStats.overallScore || 0}%</div>
            <div className="flex items-center gap-2">
              {performanceStats.improvementTrend === 'UP' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : performanceStats.improvementTrend === 'DOWN' ? (
                <TrendingDown className="w-4 h-4 text-red-600" />
              ) : (
                <Activity className="w-4 h-4 text-gray-600" />
              )}
              <span className="text-sm text-muted-foreground capitalize">
                {performanceStats.improvementTrend?.toLowerCase() || 'Stable'} trend
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assessment & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assessment Overview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Assessment Overview
              </CardTitle>
              <CardDescription>
                Track your assessment progress and submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{assessmentStats.totalAssessments || 0}</div>
                  <div className="text-sm text-blue-700">Total Assessments</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600">{assessmentStats.pendingAssessments || 0}</div>
                  <div className="text-sm text-amber-700">Pending</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{assessmentStats.completedAssessments || 0}</div>
                  <div className="text-sm text-green-700">Completed</div>
                </div>
              </div>

              {/* Recent Submissions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Submissions
                </h4>
                {recentActivity.submissions?.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-muted-foreground">No submissions yet</p>
                    <Button variant="link" className="mt-2">Start Assessment</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.submissions?.slice(0, 3).map((submission: any) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div>
                          <h5 className="font-medium">{submission.assessmentTitle}</h5>
                          <div className="flex items-center gap-3 mt-1">
                            {getStatusBadge(submission.status)}
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                            </span>
                            {submission.score && (
                              <span className="text-sm font-medium">Score: {submission.score}%</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>
                Important dates and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-muted-foreground">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`p-3 rounded-full ${event.type === 'CONTRACT_EXPIRY' ? 'bg-red-100' : 'bg-blue-100'}`}>
                        {event.type === 'CONTRACT_EXPIRY' ? (
                          <FileCheck className="w-5 h-5 text-red-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{event.title}</h5>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(event.date), 'MMM dd, yyyy')}
                          </span>
                          <Badge variant="outline" className={getPriorityColor(event.priority)}>
                            {event.priority} Priority
                          </Badge>
                        </div>
                      </div>
                      <Badge variant={event.daysUntil < 15 ? "destructive" : "outline"}>
                        {event.daysUntil} days
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Supplier Info & Quick Stats */}
        <div className="space-y-6">
          {/* Supplier Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{supplierInfo.name}</h4>
                  <p className="text-sm text-muted-foreground">{supplierInfo.contactPerson}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{supplierInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{supplierInfo.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Category</span>
                  <Badge variant="outline">{supplierInfo.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Criticality</span>
                  <Badge variant="outline" className={getPriorityColor(supplierInfo.criticality)}>
                    {supplierInfo.criticality}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={supplierInfo.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {supplierInfo.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Documents */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Documents</span>
                  <Badge variant="outline">{documentStats.totalDocuments || 0}</Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="flex-1 text-center bg-green-100 text-green-800 border-green-300">
                    ✓ {documentStats.approvedDocuments || 0}
                  </Badge>
                  <Badge variant="outline" className="flex-1 text-center">
                    ⏱️ {documentStats.pendingDocuments || 0}
                  </Badge>
                  <Badge variant="outline" className="flex-1 text-center bg-red-100 text-red-800 border-red-300">
                    ✗ {documentStats.rejectedDocuments || 0}
                  </Badge>
                </div>
              </div>

              {/* Problems */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Problems</span>
                  <Badge variant="outline">{problemStats.totalProblems || 0}</Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex-1 text-center">
                    Open: {problemStats.openProblems || 0}
                  </Badge>
                  <Badge variant="outline" className="flex-1 text-center bg-red-100 text-red-800 border-red-300">
                    High: {problemStats.highPriorityProblems || 0}
                  </Badge>
                </div>
              </div>

              {/* NIS2 Compliance */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">NIS2 Compliance</span>
                  <Badge variant={assessmentStats.pendingAssessments === assessmentStats.totalAssessments ? 'default' : 'destructive'}>
                    {assessmentStats.pendingAssessments === assessmentStats.totalAssessments ? 'Non-compliant' : 'Compliant'}
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />

              </div>
            </CardContent>
          </Card>

          {/* Risk Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Business Impact</span>
                  <span className="font-medium">{riskStats.businessScore || 0}%</span>
                </div>
                <Progress value={riskStats.businessScore || 0} className="h-2" />

                <div className="flex justify-between">
                  <span className="text-sm">Integrity</span>
                  <span className="font-medium">{riskStats.integrityScore || 0}%</span>
                </div>
                <Progress value={riskStats.integrityScore || 0} className="h-2" />

                <div className="flex justify-between">
                  <span className="text-sm">Availability</span>
                  <span className="font-medium">{riskStats.availabilityScore || 0}%</span>
                </div>
                <Progress value={riskStats.availabilityScore || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance Table */}
      <Card className="shadow-lg">
        <CardHeader>
        </CardHeader>
        <CardContent>
          <ComplianceTable />
        </CardContent>
      </Card>
    </div>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-20 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}