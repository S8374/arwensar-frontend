/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/vendor/pages/SupplierManagement/component/ComplianceStatus.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  HelpCircle,
  Timer,
  FileCheck,
  MessageSquare,
} from "lucide-react";

import {
  useGetAssessmentsQuery,
  useGetAssessmentUserByIdQuery,
} from "@/redux/features/assainment/assainment.api";
import ReviewAssessmentModal from "../model/ReviewAssessmentModal";

interface ComplianceStatusProps {
  supplier: any;
  progress: any;
  permissions : any
}

const formatDate = (date?: string | null) =>
  !date
    ? "Not set"
    : new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

export default function ComplianceStatus({ supplier, progress, permissions }: ComplianceStatusProps) {
  const { data: assessmentsResp, isLoading: loadingAssessments } = useGetAssessmentsQuery();
  const { data: submissionsResp, isLoading: loadingSubmissions } = useGetAssessmentUserByIdQuery(
    supplier.userId,
    { skip: !supplier.userId }
  );

  const assessments = assessmentsResp?.data || [];
  const submissions = submissionsResp?.data || [];

  const submissionMap = new Map<string, any>();
  submissions.forEach((sub: any) => submissionMap.set(sub.assessmentId, sub));

  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const stats = {
    total: assessments.length,
    completed: submissions.filter((s: any) => s.status === "APPROVED").length,
    pending: submissions.filter((s: any) => s.submittedAt && !s.reviewedAt).length,
    inProgress: submissions.filter((s: any) => s.status === "DRAFT").length,
    avgScore: progress?.averageScore ?? supplier.statistics?.averageScore ?? 0,
  };

  const getAssessmentStatus = (assessment: any) => {
    const submission = submissionMap.get(assessment.id);
    if (!submission) return { label: "Not Started", variant: "secondary" as const, icon: HelpCircle };
    if (submission.status === "DRAFT") return { label: "In Progress", variant: "secondary" as const, icon: Timer, progress: submission.progress };
    if (submission.submittedAt && !submission.reviewedAt) return { label: "Pending Review", variant: "warning" as const, icon: Clock };
    if (submission.status === "APPROVED") return { label: "Approved", variant: "success" as const, icon: CheckCircle2 };
    if (submission.status === "REJECTED") return { label: "Rejected", variant: "destructive" as const, icon: XCircle };
    return { label: "Submitted", variant: "default" as const, icon: FileCheck };
  };

  return (
    <div className="space-y-6">

      {/* Compliance Dashboard Card */}
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" /> Compliance Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {
            permissions.fullAssessments && 
            < div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-green-700">{stats.completed}</div>
            <p className="text-sm text-muted-foreground mt-1">Approved</p>
          </div>
          <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-xl">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-amber-700">{stats.pending}</div>
            <p className="text-sm text-muted-foreground mt-1">Pending</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-xl">
            <Timer className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-blue-700">{stats.inProgress}</div>
            <p className="text-sm text-muted-foreground mt-1">In Progress</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 rounded-xl">
            <HelpCircle className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-purple-700">{stats.total}</div>
            <p className="text-sm text-muted-foreground mt-1">Total</p>
          </div>
        </div>

}

        <Separator />

        {/* Required Assessments */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5" /> Required Assessments
          </h3>

          {(loadingAssessments || loadingSubmissions) ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-sm">Loading assessments...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm font-medium">No assessments configured</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment: any) => {
                const submission = submissionMap.get(assessment.id);
                const status = getAssessmentStatus(assessment);
                const canReview = submission && submission.submittedAt && !submission.reviewedAt;

                return (
                  <Card key={assessment.id} className="hover:shadow-md transition border">
                    <CardContent className="flex flex-col md:flex-row justify-between gap-4 p-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold">{assessment.title}</h4>
                          <Badge variant="outline" className="text-xs px-2 py-0.5">{assessment.stage}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{assessment.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> {assessment.totalQuestions} Qs</span>
                          <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> {assessment.timeLimit} min</span>
                          <span className="flex items-center gap-1"><FileCheck className="w-4 h-4" /> Pass: {assessment.passingScore}%</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-2">
                        <Badge variant={status.variant} className="text-sm px-3 py-1 flex items-center gap-1">
                          <status.icon className="w-4 h-4" /> {status.label}
                        </Badge>

                        {submission && (
                          <div className="text-xs space-y-1">
                            {submission.progress !== undefined && <div>Progress: <span className="font-semibold">{submission.progress}%</span></div>}
                            {submission.score && <div>Score: <span className="font-semibold text-primary">{submission.score}%</span></div>}
                            {submission.bivScore && <div>BIV: <span className="font-semibold">{submission.bivScore}</span></div>}
                            {submission.submittedAt && <div>Submitted: {formatDate(submission.submittedAt)}</div>}
                          </div>
                        )}

                        {canReview && (
                          <Button onClick={() => setSelectedSubmission(submission)} size="sm" className="mt-2 w-full">
                            <MessageSquare className="w-4 h-4 mr-1" /> Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

      </CardContent>
    </Card>

      {/* Review Modal */ }
  {
    selectedSubmission && (
      <ReviewAssessmentModal
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
        submission={selectedSubmission}
      />
    )
  }
    </div >
  );
}
