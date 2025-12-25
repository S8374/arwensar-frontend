// src/components/pages/dashboard/vendor/pages/SupplierManagement/component/ComplianceStatus.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  HelpCircle,
  Timer,
  FileCheck,
  AlertTriangle,
  MessageSquare,
  Calendar,
} from "lucide-react";
import {
  useGetAssessmentsQuery,
  useGetAssessmentUserByIdQuery,
} from "@/redux/features/assainment/assainment.api";
import ReviewAssessmentModal from "../model/ReviewAssessmentModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ComplianceStatusProps {
  supplier: any;
  progress: any;
}

const formatDate = (date: string | null | undefined) =>
  !date ? "Not set" : new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function ComplianceStatus({ supplier, progress }: ComplianceStatusProps) {
  const { data: assessmentsResp, isLoading: loadingAssessments } = useGetAssessmentsQuery(undefined);
  const { data: submissionsResp, isLoading: loadingSubmissions } = useGetAssessmentUserByIdQuery(supplier.userId, {
    skip: !supplier.userId,
  });

  // Single state for the review modal — outside the map!
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const assessments = assessmentsResp?.data || [];
  const submissions = submissionsResp?.data || [];

  // Map submissions by assessmentId for quick lookup
  const submissionMap = new Map<string, any>();
  submissions.forEach((sub: any) => {
    submissionMap.set(sub.assessmentId, sub);
  });

  const stats = {
    total: assessments.length,
    completed: submissions.filter((s: any) => s.status === "APPROVED").length,
    pending: submissions.filter((s: any) => s.submittedAt && !s.reviewedAt).length,
    inProgress: submissions.filter((s: any) => s.status === "DRAFT").length,
    avgScore: progress?.averageScore ?? supplier.statistics?.averageScore ?? 0,
  };

  const isNis2FullyCompliant =
    supplier.nis2Compliant === true &&
    supplier.fullAssessmentCompleted === true &&
    stats.pending === 0 &&
    stats.inProgress === 0;

  const nis2Status = isNis2FullyCompliant
    ? { label: "Fully Compliant", variant: "success" as const, icon: ShieldCheck }
    : supplier.nis2Compliant
      ? { label: "Partially Compliant", variant: "warning" as const, icon: Clock }
      : { label: "Non-Compliant", variant: "destructive" as const, icon: XCircle };

  const getAssessmentStatus = (assessment: any) => {
    const submission = submissionMap.get(assessment.id);

    if (!submission) {
      return { label: "Not Started", variant: "secondary" as const, icon: HelpCircle };
    }

    if (submission.status === "DRAFT") {
      return {
        label: "In Progress",
        variant: "secondary" as const,
        icon: Timer,
        progress: submission.progress,
      };
    }

    if (submission.submittedAt && !submission.reviewedAt) {
      return { label: "Pending Review", variant: "warning" as const, icon: Clock };
    }

    if (submission.status === "APPROVED") {
      return { label: "Approved", variant: "success" as const, icon: CheckCircle2 };
    }

    if (submission.status === "REJECTED") {
      return { label: "Rejected", variant: "destructive" as const, icon: XCircle };
    }

    return { label: "Submitted", variant: "default" as const, icon: FileCheck };
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-2xl border-2">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-3xl">
          <CardTitle className="text-3xl flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
            Compliance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-10 space-y-12">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-green-50 dark:bg-green-950/30 border border-green-200 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-5xl font-bold text-green-700">{stats.completed}</div>
              <p className="text-lg text-muted-foreground mt-2">Approved</p>
            </div>
            <div className="text-center p-8 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-2xl">
              <Clock className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <div className="text-5xl font-bold text-amber-700">{stats.pending}</div>
              <p className="text-lg text-muted-foreground mt-2">Pending Review</p>
            </div>
            <div className="text-center p-8 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-2xl">
              <Timer className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-5xl font-bold text-blue-700">{stats.inProgress}</div>
              <p className="text-lg text-muted-foreground mt-2">In Progress</p>
            </div>
            <div className="text-center p-8 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 rounded-2xl">
              <HelpCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-5xl font-bold text-purple-700">{stats.total}</div>
              <p className="text-lg text-muted-foreground mt-2">Total Required</p>
            </div>
          </div>

          <Separator />

          {/* NIS2 Compliance Status */}
          <div className="p-10 border-2 rounded-2xl bg-gradient-to-r from-muted/30 to-card shadow-inner">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className={`p-6 rounded-full shadow-2xl ${
                  nis2Status.variant === "success" ? "bg-green-100 text-green-700" :
                  nis2Status.variant === "warning" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  <nis2Status.icon className="w-14 h-14" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-3">NIS2 Directive Compliance</h3>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    {isNis2FullyCompliant
                      ? "This supplier has completed all required assessments and is fully compliant with NIS2 directive."
                      : supplier.nis2Compliant
                        ? "Supplier has declared compliance, but some assessments are still pending review or in progress."
                        : "Supplier has not yet achieved compliance with NIS2 requirements."}
                  </p>
                </div>
              </div>
              <Badge variant={nis2Status.variant} className="text-2xl px-10 py-5 shadow-lg">
                {nis2Status.label}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Required Assessments */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <FileCheck className="w-8 h-8" />
              Required Assessments
            </h3>

            {(loadingAssessments || loadingSubmissions) ? (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-6 animate-spin" />
                <p className="text-xl">Loading assessments and submissions...</p>
              </div>
            ) : assessments.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="w-20 h-20 text-muted-foreground mx-auto mb-8 opacity-50" />
                <p className="text-2xl font-semibold">No assessments configured</p>
              </div>
            ) : (
              <div className="space-y-8">
                {assessments.map((assessment: any) => {
                  const submission = submissionMap.get(assessment.id);
                  const status = getAssessmentStatus(assessment);

                  const canReview = submission && (submission.submittedAt && !submission.reviewedAt);

                  return (
                    <Card key={assessment.id} className="hover:shadow-2xl transition-all duration-300 border-2">
                      <CardContent className="pt-8 pb-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                          <div className="flex-1 space-y-5">
                            <div className="flex items-center gap-4">
                              <h4 className="text-2xl font-bold">{assessment.title}</h4>
                              <Badge variant="outline" className="text-base px-4 py-1">
                                {assessment.stage}
                              </Badge>
                            </div>
                            <p className="text-lg text-muted-foreground">{assessment.description}</p>
                            <div className="flex flex-wrap gap-8 text-base">
                              <span className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5" />
                                {assessment.totalQuestions} questions
                              </span>
                              <span className="flex items-center gap-2">
                                <Timer className="w-5 h-5" />
                                {assessment.timeLimit} minutes
                              </span>
                              <span className="flex items-center gap-2">
                                <FileCheck className="w-5 h-5" />
                                Passing: {assessment.passingScore}%
                              </span>
                            </div>
                          </div>

                          <div className="lg:text-right space-y-4">
                            <div>
                              <Badge
                                variant={status.variant}
                                className="text-xl px-6 py-3 flex items-center gap-3 shadow-lg"
                              >
                                <status.icon className="w-6 h-6" />
                                {status.label}
                              </Badge>
                            </div>

                            {submission && (
                              <div className="space-y-2 text-base">
                                {submission.progress !== undefined && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Progress</p>
                                    <p className="font-bold text-2xl">{submission.progress}%</p>
                                  </div>
                                )}
                                {submission.score && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Score</p>
                                    <p className="font-bold text-2xl text-primary">{submission.score}%</p>
                                  </div>
                                )}
                                {submission.bivScore && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">BIV Score</p>
                                    <p className="font-bold text-xl">{submission.bivScore}</p>
                                  </div>
                                )}
                                {submission.submittedAt && (
                                  <p className="text-sm text-muted-foreground mt-3">
                                    Submitted: {formatDate(submission.submittedAt)}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Review Button */}
                            {canReview && (
                              <Button
                                onClick={() => setSelectedSubmission(submission)}
                                size="lg"
                                className="mt-4 w-full"
                              >
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Review Submission
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Milestone Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-10 shadow-xl">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-5" />
              <p className="text-lg text-muted-foreground mb-3">Last Assessment</p>
              <p className="text-2xl font-bold">{formatDate(supplier.lastAssessmentDate)}</p>
            </Card>
            <Card className="text-center p-10 shadow-xl">
              <FileCheck className={`w-12 h-12 mx-auto mb-5 ${supplier.initialAssessmentCompleted ? "text-green-600" : "text-muted-foreground"}`} />
              <p className="text-lg text-muted-foreground mb-3">Initial Assessment</p>
              <p className="text-2xl font-bold">
                {supplier.initialAssessmentCompleted ? "Completed" : "Pending"}
              </p>
            </Card>
            <Card className="text-center p-10 shadow-xl">
              <ShieldCheck className={`w-12 h-12 mx-auto mb-5 ${supplier.fullAssessmentCompleted ? "text-green-600" : "text-amber-600"}`} />
              <p className="text-lg text-muted-foreground mb-3">Full Assessment</p>
              <p className="text-2xl font-bold">
                {supplier.fullAssessmentCompleted ? "Completed" : "Pending"}
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Single Review Modal — outside the map */}
      {selectedSubmission && (
        <ReviewAssessmentModal
          open={!!selectedSubmission}
          onOpenChange={(open) => !open && setSelectedSubmission(null)}
          submission={selectedSubmission}
          onSuccess={() => {
            // Optional: refetch submissions or assessments here
          }}
        />
      )}
    </div>
  );
}