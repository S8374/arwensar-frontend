/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/supplier/SupplierDashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  AlertCircle,
 
  Clock,

  BarChart3,

} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetSupplierDashboardQuery } from "@/redux/features/supplyer/supplyer.api";
import ComplianceTable from "./components/overviewComponent/Compliancetable";
import { formatDistanceToNow } from "date-fns";

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading } = useGetSupplierDashboardQuery();

  // Default fallback
  const rawStats = dashboardData?.data || {
    totalAssessments: 0,
    pendingAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
    riskLevel: null,
    bivScore: null,
    nextAssessmentDue: null,
    recentSubmissions: [],
    nis2Status: {
      isCompliant: false,
      progress: 0,
      requiredAssessments: 2,
      completedAssessments: 0
    }
  };


  const assessments = rawStats.assessments || []; 

  const initialApproved = assessments.some(
    (a: any) => a.stage === "INITIAL" && a.submission?.status === "APPROVED"
  );
  const fullApproved = assessments.some(
    (a: any) => a.stage === "FULL" && a.submission?.status === "APPROVED"
  );

  const nis2Compliant = initialApproved && fullApproved;
  const nis2Progress = initialApproved && fullApproved ? 100 :
                      initialApproved || fullApproved ? 50 : 0;

  const stats = {
    ...rawStats,
    nis2Status: {
      isCompliant: nis2Compliant,
      progress: nis2Progress,
      requiredAssessments: 2,
      completedAssessments: (initialApproved ? 1 : 0) + (fullApproved ? 1 : 0)
    }
  };
   console.log("stats" , stats);
  const getRiskLevelColor = (level: string | null) => {
    if (!level) return "bg-gray-100 text-gray-800";
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Supplier Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Monitor your compliance progress and assessment status
        </p>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAssessments}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.completedAssessments} completed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Assessment</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingAssessments}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Awaiting completion or review
            </p>
          </CardContent>
        </Card>


        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-sm font-medium">Current Risk Level</CardTitle>
            <AlertCircle className=" w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.riskLevel ? (
                <Badge className={getRiskLevelColor(stats.riskLevel)}>
                  {stats.riskLevel}
                </Badge>
              ) : (
                <span className="text-muted-foreground">Not Assessed</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              BIV Score: {stats.bivScore ? `${stats.bivScore.toFixed(1)}` : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

   
      {/* Recent Submissions */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              Recent Submissions
            </CardTitle>
            
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-muted-foreground">No submissions yet</p>
              <p className="text-sm mt-2">Start your first assessment to see activity here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentSubmissions.map((submission: any) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/supplier/assessments/submissions/${submission.id}`)}
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{submission.assessmentTitle}</h4>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                      </span>
                      <Badge variant="outline">{submission.status}</Badge>
                      {submission.score && (
                        <span className="font-medium text-foreground">Score: {submission.score}%</span>
                      )}
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Progress Table */}
      <ComplianceTable />
    </div>
  );
}