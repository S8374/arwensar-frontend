// src/components/pages/dashboard/vendor/pages/SupplierManagement/component/SupplierComplianceTab.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, FileText, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface AssessmentSubmission {
  id: string;
  assessment: {
    id: string;
    title: string;
    examId: string;
  };
  status: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  submittedAt: string;
  reviewedAt?: string;
}

interface Props {
  supplierId: string;
  supplierName: string;
  submissions: AssessmentSubmission[];
}

export default function SupplierComplianceTab({  submissions }: Props) {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Filter submissions based on selected status
  const filteredSubmissions = selectedStatus === "ALL"
    ? submissions
    : submissions.filter(sub => sub.status === selectedStatus);

  // Get latest submission
  const latestSubmission = submissions.length > 0
    ? submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0]
    : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" /> Pending Review</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case "NEEDS_REVISION":
        return <Badge className="bg-orange-100 text-orange-700"><AlertCircle className="w-3 h-3 mr-1" /> Needs Revision</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Assessments</p>
            <p className="text-2xl font-bold">{submissions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {submissions.filter(s => s.status === "APPROVED").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {submissions.filter(s => ["SUBMITTED", "UNDER_REVIEW"].includes(s.status)).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Latest Score</p>
            <p className={`text-2xl font-bold ${latestSubmission ? getScoreColor(latestSubmission.score) : "text-muted-foreground"}`}>
              {latestSubmission ? `${latestSubmission.score}/100` : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Assessment (if exists) */}
      {latestSubmission && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Latest Assessment</CardTitle>
              {getStatusBadge(latestSubmission.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Assessment</p>
                <p className="font-semibold">{latestSubmission.assessment.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-semibold">{format(new Date(latestSubmission.submittedAt), "MMM dd, yyyy HH:mm")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className={`font-bold text-2xl ${getScoreColor(latestSubmission.score)}`}>
                  {latestSubmission.score}/100
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                onClick={() => navigate(`/vendor/assainment/${latestSubmission.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={selectedStatus === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedStatus("ALL")}
        >
          All ({submissions.length})
        </Button>
        <Button
          variant={selectedStatus === "APPROVED" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedStatus("APPROVED")}
        >
          Approved ({submissions.filter(s => s.status === "APPROVED").length})
        </Button>
        <Button
          variant={selectedStatus === "SUBMITTED" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedStatus("SUBMITTED")}
        >
          Pending Review ({submissions.filter(s => ["SUBMITTED", "UNDER_REVIEW"].includes(s.status)).length})
        </Button>
        <Button
          variant={selectedStatus === "NEEDS_REVISION" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedStatus("NEEDS_REVISION")}
        >
          Needs Revision ({submissions.filter(s => s.status === "NEEDS_REVISION").length})
        </Button>
        <Button
          variant={selectedStatus === "REJECTED" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedStatus("REJECTED")}
        >
          Rejected ({submissions.filter(s => s.status === "REJECTED").length})
        </Button>
      </div>

      {/* Assessment List */}
      <Card>
        <CardHeader>
          <CardTitle>All Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No assessments found for this supplier</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{submission.assessment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          ID: {submission.assessment.examId} •
                          Submitted: {format(new Date(submission.submittedAt), "MMM dd, yyyy")}
                        </p>
                        <p className="text-sm mt-1">
                          Questions: {submission.answeredQuestions}/{submission.totalQuestions} •
                          Score: <span className={`font-bold ${getScoreColor(submission.score)}`}>{submission.score}/100</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(submission.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/vendor/assainment/${submission.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}