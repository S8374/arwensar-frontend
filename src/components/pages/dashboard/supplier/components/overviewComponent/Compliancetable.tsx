/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/supplier/components/overviewComponent/ComplianceTable.tsx
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useGetAssessmentsQuery, useGetMySubmissionsQuery } from "@/redux/features/assainment/assainment.api";

export default function ComplianceTable() {
  const navigate = useNavigate();

  const { data: assessmentsResponse, isLoading: loadingAssessments } = useGetAssessmentsQuery();
  const { data: submissionsResponse, isLoading: loadingSubmissions } = useGetMySubmissionsQuery();

  const assessments = assessmentsResponse?.data || [];
  const submissions = submissionsResponse?.data || [];

  // Map submissions by assessmentId
  const submissionMap = new Map<string, any>();
  submissions.forEach((sub: any) => {
    submissionMap.set(sub.assessmentId, sub);
  });

  // Merge assessments with their submission (if exists)
  const mergedData = assessments.map((assessment: any) => ({
    ...assessment,
    submission: submissionMap.get(assessment.id) || null,
  }));

  // Sort: In Progress → Submitted → Not Started → Approved
  const sortedData = [...mergedData].sort((a, b) => {
    const getPriority = (item: any) => {
      if (!item.submission) return 4; // Not started
      switch (item.submission.status) {
        case "DRAFT": return 1;
        case "SUBMITTED": return 2;
        case "UNDER_REVIEW": return 3;
        case "REQUIRES_ACTION": return 0;
        case "APPROVED": return 5;
        case "REJECTED": return 6;
        default: return 4;
      }
    };
    return getPriority(a) - getPriority(b);
  });

  const getStatusBadge = (submission: any) => {
    if (!submission) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Not Started
        </Badge>
      );
    }

    switch (submission.status) {
      case "DRAFT":
        return submission.progress > 0 ? (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress ({submission.progress}%)
          </Badge>
        ) : (
          <Badge variant="secondary">Started</Badge>
        );
      case "SUBMITTED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Submitted
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "REQUIRES_ACTION":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Action Required
          </Badge>
        );
      default:
        return <Badge variant="secondary">{submission.status}</Badge>;
    }
  };

  const getProgressColor = (progress: number, status?: string) => {
    if (status === "APPROVED") return "bg-green-600";
    if (status === "REJECTED") return "bg-red-600";
    if (status === "REQUIRES_ACTION") return "bg-orange-600";
    if (progress === 100) return "bg-blue-600";
    if (progress > 0) return "bg-blue-500";
    return "bg-gray-300";
  };

  const getScoreDisplay = (score: string | null) => {
    if (!score) return <span className="text-muted-foreground">—</span>;

    const numScore = parseFloat(score);
    const colorClass =
      numScore >= 80 ? "bg-green-100 text-green-800" :
        numScore >= 60 ? "bg-yellow-100 text-yellow-800" :
          numScore >= 40 ? "bg-orange-100 text-orange-800" :
            "bg-red-100 text-red-800";

    return (
      <span className={cn(
        "inline-flex items-center justify-center w-16 h-10 rounded-full font-bold text-lg",
        colorClass
      )}>
        {numScore}%
      </span>
    );
  };

  const getLastActivity = (submission: any) => {
    if (!submission) return "Never";

    const date = submission.submittedAt || submission.updatedAt || submission.startedAt;
    if (!date) return "Never";

    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handlePrimaryAction = (assessment: any) => {
    const submission = assessment.submission;

    if (!submission) {
      // No submission → Start new assessment
      navigate(`/supplier/assessments/${assessment.id}`);
    } else if (submission.status === "DRAFT") {
      // Draft → Continue answering
      navigate(`/supplier/assessments/${assessment.id}`);
    } else {
      // Submitted or reviewed → View submission
      navigate(`/supplier/assessments/${assessment.id}`);
    }
  };

  const getPrimaryButtonText = (assessment: any) => {
    const submission = assessment.submission;

    if (!submission) return "Start Assessment";
    if (submission.status === "DRAFT") return "Continue";
    if (submission.status === "SUBMITTED" || submission.status === "UNDER_REVIEW") return "View Submission";
    if (submission.status === "APPROVED") return "View Results";
    if (submission.status === "REJECTED") return "View Feedback";
    if (submission.status === "REQUIRES_ACTION") return "Take Action";
    return "View";
  };

  const isLoading = loadingAssessments || loadingSubmissions;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <h2 className="text-2xl font-bold">Compliance Progress</h2>
        </CardHeader>
        <CardContent className="py-12">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sortedData.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center">
        <CardHeader>
          <h2 className="text-2xl font-bold">Compliance Progress</h2>
        </CardHeader>
        <CardContent className="py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
            <p className="text-xl font-medium text-muted-foreground">
              No assessments assigned yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Your vendor will assign assessments when ready.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Compliance Progress</h2>
            <p className="text-muted-foreground mt-1">
              Complete assessments to maintain compliance
            </p>
          </div>
          <Badge variant="outline" className="text-sm px-4 py-1">
            {sortedData.length} Assessment{sortedData.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">Assessment</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Last Activity</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((assessment: any) => {
                const submission = assessment.submission;
                const progress = submission?.progress || 0;
                const score = submission?.score;

                return (
                  <TableRow key={assessment.id} className="hover:bg-gray-50">
                    <TableCell className="py-6">
                      <div>
                        <p className="font-semibold text-lg">{assessment.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {assessment.description || "No description"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          assessment.stage === "INITIAL"
                            ? "border-blue-300 text-blue-700 bg-blue-50"
                            : "border-purple-300 text-purple-700 bg-purple-50"
                        )}
                      >
                        {assessment.stage === "INITIAL" ? "Initial Scan" : "Full Assessment"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(submission)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Progress
                          value={progress}
                          className={cn("w-32 h-4", getProgressColor(progress, submission?.status))}
                        />
                        <span className="font-bold text-lg min-w-12 text-right">
                          {progress}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {getScoreDisplay(score)}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {getLastActivity(submission)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (submission?.id) {
                              navigate(`/supplier/assessments/${assessment.id}`);
                            } else {
                              navigate(`/supplier/assessments/${assessment.id}`);
                            }
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handlePrimaryAction(assessment)}
                          className={cn(
                            "text-white",
                            submission?.status === "APPROVED" && "bg-green-600 hover:bg-green-700",
                            submission?.status === "REJECTED" && "bg-red-600 hover:bg-red-700",
                            submission?.status === "REQUIRES_ACTION" && "bg-orange-600 hover:bg-orange-700",
                            !submission && "bg-blue-600 hover:bg-blue-700"
                          )}
                        >
                          {getPrimaryButtonText(assessment)}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

