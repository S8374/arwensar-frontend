import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  AlertCircle,
  Clock,
  FileCheck,
  Shield,
  Download,
  Check,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAssainmentByIdQuery, useGetSubmissionByIdQuery } from "@/redux/features/vendor/vendor.api";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import DocumentApproveModal from "../../../model/AssessmentReviewModal";
;

interface Answer {
  id: string;
  answer: "YES" | "NO" | "PARTIAL";
  comments: string;
  evidence: string | null;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}

interface SubmissionData {
  id: string;
  score: number;
  riskScore: number;
  status: string;
  createdAt: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewerReport: string | null;
  answeredQuestions: number;
  totalQuestions: number;
  answers: Answer[];
  supplier: {
    name: string;
    category: string;
  };
  assessment: {
    title: string;
    id: string;
  };
  vendor: {
    companyName: string;
    firstName: string;
    lastName: string;
  };
  assessmentId: string; // ← ADD THIS LINE
}

interface Question {
  id: string;
  questionId: number;
  question: string;
  order: number;
  isDocument: boolean;
  isInputField: boolean;
  categoryId: string; // ✅ ADD THIS

}

interface AssessmentData {
  id: string;
  title: string;
  description: string;
  categories: Array<{
    id: any;
    title: string;
    questions: Question[];
  }>;
}

const getAnswerIcon = (answer: string) => {
  switch (answer) {
    case "YES":
      return <CheckCircle2 className="w-5 h-5" />;
    case "NO":
      return <XCircle className="w-5 h-5" />;
    case "PARTIAL":
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getAnswerColor = (answer: string) => {
  switch (answer) {
    case "YES":
      return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30";
    case "NO":
      return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900/30";
    case "PARTIAL":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "SUBMITTED":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"><Clock className="w-3 h-3 mr-1" /> Submitted</Badge>;
    case "APPROVED":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
    case "REJECTED":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
    case "PENDING":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  } catch {
    return dateString;
  }
};

// Function to match answers with questions
const getQuestionAnswerPairs = (assessmentData: AssessmentData, answers: Answer[]) => {
  const allQuestions = assessmentData.categories.flatMap(category =>
    category.questions.map(question => ({
      ...question,
      categoryTitle: category.title
    }))
  );

  // Sort questions by order
  allQuestions.sort((a, b) => a.order - b.order);
  console.log('allQuestions', allQuestions)
  // Match each question with its answer
  return allQuestions.map(question => {
    const answer = answers.find(ans => ans.questionId === question.id);
    return {
      question,
      answer,
      hasAnswer: !!answer
    };
  });
};

export default function SupplierAssessmentDetails() {
  const { supplierId, assainmentId } = useParams<{
    supplierId: string;
    assainmentId: string;
  }>();
  const navigate = useNavigate();
  const {
    data: apiResponse,
    isLoading: isSubmissionLoading,
    error: submissionError
  } = useGetSubmissionByIdQuery(supplierId!, {
    skip: !supplierId,
    refetchOnMountOrArgChange: true,
  });
  const [openModal, setOpenModal] = useState(false);

  const {
    data: assessmentApiResponse,
    isLoading: isAssessmentLoading,
    error: assessmentError
  } = useGetAssainmentByIdQuery(assainmentId!, {
    skip: !assainmentId,
    refetchOnMountOrArgChange: true,
  });

  // Find the specific submission that matches the assessmentId
  const submissionData = useMemo(() => {
    if (!apiResponse?.data) return undefined;

    console.log("All submissions:", apiResponse.data);
    console.log("Looking for assessmentId:", assainmentId);

    // Find submission with matching assessmentId
    const foundSubmission = apiResponse.data.find(
      (sub: any) => sub.assessmentId === assainmentId
    );

    console.log("Found submission:", foundSubmission);
    return foundSubmission as SubmissionData | undefined;
  }, [apiResponse?.data, assainmentId]); const assessmentData = assessmentApiResponse?.data as AssessmentData | undefined;

  const isLoading = isSubmissionLoading || isAssessmentLoading;
  const error = submissionError || assessmentError;

  console.log("submissionData", submissionData);
  console.log("assessmentData", assessmentData);
  // Add the mutation hook
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 pb-10 p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Separator />
        <Skeleton className="h-40 w-full" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !submissionData || !assessmentData) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 pb-10 p-6">
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Unable to load assessment</h2>
          <p className="text-muted-foreground mb-6">
            {error ? "An error occurred while loading the assessment." : "No assessment data found."}
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const {
    supplier,
    assessment,
    score,
    riskScore,
    status,
    answers,
    answeredQuestions,
    totalQuestions,
    submittedAt,
    vendor
  } = submissionData;
  // Get question-answer pairs
  const questionAnswerPairs = getQuestionAnswerPairs(assessmentData, answers);
  // Filter to show only answered questions
  const answeredPairs = questionAnswerPairs.filter(pair => pair.hasAnswer);
  const completionPercentage = totalQuestions > 0
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0;
  console.log("his apiResponse", apiResponse);
  console.log("answeredPairs", answeredPairs)
  return (
    <div className="w-full  mx-auto space-y-8 pb-10 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {assessment?.title || assessmentData?.title || "Security Assessment"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {assessmentData?.description || "Supplier's self-assessment responses (Read-only)"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="hidden sm:flex"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Back to History
          </Button>
        </div>
      </div>

      <Separator />

      {/* Assessment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score</p>
                <p className="text-3xl font-bold mt-2">{score}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                <p className="text-3xl font-bold mt-2">{riskScore}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion</p>
                <p className="text-3xl font-bold mt-2">{completionPercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {answeredQuestions} of {totalQuestions} questions
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="mt-3">
                {getStatusBadge(status)}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Submitted on {formatDate(submittedAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Info Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{supplier?.name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{supplier?.category}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Submitted to: {vendor?.companyName || "Vendor Company"}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Assessment ID: {submissionData.id.substring(0, 8)}...
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Categories and Questions List */}
      {assessmentData.categories.map((category, catIndex) => {
        // Get questions for this category that have answers
        const categoryAnsweredPairs = answeredPairs.filter(
          pair => pair.question.categoryId === category.id
        );

        if (categoryAnsweredPairs.length === 0) return null;

        return (
          <div key={category.id} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">
                {category.title || `Category ${catIndex + 1}`}
              </h2>
              <Badge variant="outline" className="ml-2">
                {categoryAnsweredPairs.length} answered
              </Badge>
            </div>

            {categoryAnsweredPairs.map((pair, index) => (
              <Card key={pair.question.id} className="overflow-hidden border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left: Question & Details */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="text-lg font-semibold text-foreground">
                            Q{pair.question.order || index + 1}
                          </div>

                        </div>
                        <div className="flex-1 space-y-4">
                          {/* Question Text */}
                          <div>
                            <h3 className="text-lg font-medium text-foreground leading-relaxed">
                              {pair.question.question}
                            </h3>
                          </div>

                          {/* Answer Section */}
                          {pair.answer && (
                            <>
                              {/* Answer with status */}
                              <div className="flex items-center gap-3 mt-4">
                                <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full font-medium text-sm border ${getAnswerColor(pair.answer.answer)}`}>
                                  {getAnswerIcon(pair.answer.answer)}
                                  {pair.answer.answer}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  Answered on {formatDate(pair.answer.createdAt)}
                                </span>
                              </div>

                              {/* Comments */}
                              {pair.answer.comments && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-foreground mb-2">Supplier Comments:</p>
                                  <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm text-foreground/90 leading-relaxed">
                                      {pair.answer.comments}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Evidence */}
                              {pair.answer.evidence ? (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-foreground mb-2">Supporting Evidence:</p>
                                  <div className="flex items-center gap-3">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-9"
                                      onClick={() => window.open(pair.answer!.evidence!, '_blank')}
                                    >
                                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                                      View Evidence
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-9"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = pair.answer!.evidence!;
                                        link.download = `evidence-${pair.question.order || index + 1}.pdf`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                      }}
                                    >
                                      <Download className="w-3.5 h-3.5 mr-1.5" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-foreground mb-2">Supporting Evidence:</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <AlertCircle className="w-4 h-4" />
                                    No evidence provided
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })}


      {/* Action Footer - Only show if status is SUBMITTED */}

      {status === "PENDING" && (
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Once approved or rejected, this action cannot be undone.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>



            <Button
              size="lg"
              className="min-w-32 bg-green-600 hover:bg-green-700"
              onClick={() => setOpenModal(true)}

            >

              <Check className="w-4 h-4 mr-2" />
              Approve


            </Button>
          </div>
        </div>
      )}


      {/* Review Info - Show if already reviewed */}
      {status !== "APPROVED" && submissionData.reviewedAt && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Review Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Review Date</p>
                  <p className="text-foreground">{formatDate(submissionData.reviewedAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Final Status</p>
                  <div className="mt-1">
                    {getStatusBadge(status)}
                  </div>
                </div>
              </div>

              {submissionData.reviewerReport && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Reviewer Comments</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {submissionData.reviewerReport}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ MODAL FROM DIFFERENT FILE */}
      <DocumentApproveModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        submissionID={submissionData.id}
      />
    </div>
  );
}