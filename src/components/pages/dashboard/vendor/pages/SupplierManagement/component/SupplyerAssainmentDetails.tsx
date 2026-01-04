import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Clock,
  FileCheck,
  Shield,
} from "lucide-react";
import { useState } from "react";
import DocumentApproveModal from "../../../model/AssessmentReviewModal";
import { format } from "date-fns";

// ===== MOCK JSON DATA =====
const mockSubmissionData = {
  id: "sub12345",
  score: 85,
  riskScore: 15,
  status: "PENDING",
  createdAt: "2025-12-01T10:00:00Z",
  submittedAt: "2025-12-02T15:30:00Z",
  reviewedAt: null,
  reviewerReport: null,
  answeredQuestions: 3,
  totalQuestions: 3,
  answers: [
    {
      id: "ans1",
      questionId: "q1",
      answer: "YES",
      comments: "All good here",
      evidence: null,
      createdAt: "2025-12-02T10:00:00Z",
      updatedAt: "2025-12-02T10:00:00Z",
    },
    {
      id: "ans2",
      questionId: "q2",
      answer: "NO",
      comments: "Missing documents",
      evidence: "https://example.com/evidence.pdf",
      createdAt: "2025-12-02T11:00:00Z",
      updatedAt: "2025-12-02T11:00:00Z",
    },
    {
      id: "ans3",
      questionId: "q3",
      answer: "PARTIAL",
      comments: "Partially complete",
      evidence: null,
      createdAt: "2025-12-02T12:00:00Z",
      updatedAt: "2025-12-02T12:00:00Z",
    },
  ],
  supplier: { name: "ABC Supplies", category: "Electronics" },
  vendor: { companyName: "Tech Vendor Co.", firstName: "John", lastName: "Doe" },
  assessment: { id: "assess1", title: "Security Assessment" },
  assessmentId: "assess1",
};

const mockAssessmentData = {
  id: "assess1",
  title: "Security Assessment",
  description: "Supplier's self-assessment responses (Read-only)",
  categories: [
    {
      id: "cat1",
      title: "Documentation",
      questions: [
        { id: "q1", question: "Has the supplier submitted all documents?", order: 1, isDocument: true, isInputField: false, categoryId: "cat1" },
        { id: "q2", question: "Are the submitted documents valid?", order: 2, isDocument: true, isInputField: false, categoryId: "cat1" },
      ],
    },
    {
      id: "cat2",
      title: "Compliance",
      questions: [
        { id: "q3", question: "Is the supplier compliant with NIS2?", order: 3, isDocument: false, isInputField: true, categoryId: "cat2" },
      ],
    },
  ],
};

// ===== HELPER FUNCTIONS =====
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
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"><Clock className="w-3 h-3 mr-1" /> Submitted</Badge>;
    case "APPROVED":
      return <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
    case "REJECTED":
      return <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
    case "PENDING":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
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

const getQuestionAnswerPairs = (assessmentData: typeof mockAssessmentData, answers: typeof mockSubmissionData.answers) => {
  const allQuestions = assessmentData.categories.flatMap(category =>
    category.questions.map(q => ({ ...q, categoryTitle: category.title }))
  );
  allQuestions.sort((a, b) => a.order - b.order);

  return allQuestions.map(question => {
    const answer = answers.find(ans => ans.questionId === question.id);
    return {
      question,
      answer,
      hasAnswer: !!answer
    };
  });
};

// ===== COMPONENT =====
export default function SupplierAssessmentDetailsMock() {
  const [openModal, setOpenModal] = useState(false);

  const submissionData = mockSubmissionData;
  const assessmentData = mockAssessmentData;

  const { score, riskScore, status, answers, answeredQuestions, totalQuestions, submittedAt } = submissionData;

  const questionAnswerPairs = getQuestionAnswerPairs(assessmentData, answers);
  const answeredPairs = questionAnswerPairs.filter(pair => pair.hasAnswer);
  const completionPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="w-full mx-auto space-y-8 pb-10 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{assessmentData.title}</h1>
          <p className="text-muted-foreground mt-2">{assessmentData.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden sm:flex">
            <FileText className="w-4 h-4 mr-2" /> Export Report
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
                <p className="text-xs text-muted-foreground mt-1">{answeredQuestions} of {totalQuestions} questions</p>
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
              <div className="mt-3">{getStatusBadge(status)}</div>
              <p className="text-xs text-muted-foreground mt-3">Submitted on {formatDate(submittedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories & Questions */}
      {assessmentData.categories.map((category) => {
        const categoryAnsweredPairs = answeredPairs.filter(pair => pair.question.categoryId === category.id);
        if (!categoryAnsweredPairs.length) return null;

        return (
          <div key={category.id} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
              <Badge variant="outline">{categoryAnsweredPairs.length} answered</Badge>
            </div>
            {categoryAnsweredPairs.map((pair, index) => (
              <Card key={pair.question.id}>
                <CardContent>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 text-lg font-semibold text-foreground">
                          Q{pair.question.order || index + 1}
                        </div>
                        <div className="flex-1 space-y-4">
                          <h3 className="text-lg font-medium text-foreground leading-relaxed">{pair.question.question}</h3>
                          {pair.answer && (
                            <>
                              <div className="flex items-center gap-3 mt-4">
                                <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full font-medium text-sm border ${getAnswerColor(pair.answer.answer)}`}>
                                  {getAnswerIcon(pair.answer.answer)}
                                  {pair.answer.answer}
                                </div>
                                <span className="text-xs text-muted-foreground">Answered on {formatDate(pair.answer.createdAt)}</span>
                              </div>
                              {pair.answer.comments && <div className="mt-4 bg-muted/50 rounded-lg p-4">{pair.answer.comments}</div>}
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

      {/* Modal */}
      <DocumentApproveModal open={openModal} onClose={() => setOpenModal(false)} submissionID={submissionData.id} />
    </div>
  );
}
