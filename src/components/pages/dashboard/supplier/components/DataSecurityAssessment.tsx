// DataSecurityAssessment.tsx
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Upload, ChevronRight, CheckCircle2, Circle, Eye, FileText, ArrowLeft } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetDrafAssainmentByAssainmentIDQuery,
  useSaveDarftAssainmentMutation,
  useSubmitAssessmentMutation,
} from "@/redux/features/supplyer/supplyer.api";
import { useGetAssainmentByIdQuery, useGetSubmissionByIdQuery } from "@/redux/features/vendor/vendor.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

interface Answer {
  questionId: string;
  answer: "YES" | "NO" | "PARTIAL" | "NOT_APPLICABLE";
  comments?: string;
  evidence?: string;
}

interface Question {
  id: string;
  questionId: number;
  question: string;
  isInputField: boolean;
  isDocument: boolean;
}

interface SubmissionAnswer {
  id: string;
  answer: string;
  comments?: string;
  evidence?: string;
  questionId: string;
}

export default function DataSecurityAssessment() {
  const { assainmetId } = useParams<{ assainmetId: string }>();
  const navigate = useNavigate();

  const { data: assessmentData, isLoading: loadingAssessment } = useGetAssainmentByIdQuery(assainmetId!);
  const { data: draftData, isLoading: loadingDraft } = useGetDrafAssainmentByAssainmentIDQuery(assainmetId!);

  const [saveDraft, { isLoading: saving }] = useSaveDarftAssainmentMutation();
  const [submitFinal, { isLoading: submitting }] = useSubmitAssessmentMutation();
  const { data: userData } = useUserInfoQuery(undefined);
  
  // Use supplierId from userData to fetch submissions
  const supplierId = userData?.data?.supplier?.id;
  const { data: mySubmissions, isLoading: isLoadingSub } = useGetSubmissionByIdQuery(supplierId || "");

  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  // Find the relevant submission for this assessment
  const currentSubmission = useMemo(() => {
    if (!mySubmissions?.data || !assainmetId) return null;
    return mySubmissions.data.find(
      (sub: any) => sub.assessmentId === assainmetId
    );
  }, [mySubmissions?.data, assainmetId]);

const isSubmitted =
  currentSubmission?.status === "PENDING" ||
  currentSubmission?.status === "REGECT" ||
  currentSubmission?.status === "APPROVED";
  const submittedAnswers = useMemo(() => {
    if (!isSubmitted || !currentSubmission?.answers) return {};
    
    const answersMap: Record<string, SubmissionAnswer> = {};
    currentSubmission.answers.forEach((ans: SubmissionAnswer) => {
      answersMap[ans.questionId] = ans;
    });
    return answersMap;
  }, [currentSubmission, isSubmitted]);

  // Memoize questions to prevent re-creation
  const questions: Question[] = useMemo(() => {
    if (!assessmentData?.data?.categories) return [];
    return assessmentData.data.categories.flatMap((cat: any) =>
      cat.questions.map((q: any) => ({
        id: q.id,
        questionId: q.questionId,
        question: q.question,
        isInputField: q.isInputField || false,
        isDocument: q.isDocument || false,
      }))
    );
  }, [assessmentData?.data?.categories]);

  const totalQuestions = questions.length;

  // Load draft ONLY ONCE when draft data arrives
  useEffect(() => {
    if (isSubmitted) return; // Don't load draft if already submitted
    
    if (!draftData?.data?.answers || draftData.data.answers.length === 0) return;
    if (Object.keys(answers).length > 0) return; // Prevent override if already loaded

    const loaded: Record<string, Answer> = {};

    draftData.data.answers.forEach((ans: any) => {
      const question = questions.find(
        (q) => q.questionId.toString() === ans.question.questionId.toString()
      );
      if (question) {
        loaded[question.id] = {
          questionId: question.questionId.toString(),
          answer: ans.answer,
          comments: ans.comments || "",
          evidence: ans.evidence || undefined,
        };
      }
    });

    setAnswers(loaded);
    if (Object.keys(loaded).length > 0) {
      toast.success("Your previous answers have been loaded!");
    }
  }, [draftData?.data?.answers, questions, isSubmitted]);

  const handleAnswerChange = (qId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || { questionId: questions.find(q => q.id === qId)?.questionId.toString() }),
        answer: value as any,
      },
    }));
  };

  const handleCommentChange = (qId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], comments: value },
    }));
  };

  const handleFileUpload = async (qId: string, file: File | null) => {
    if (!file) return;

    toast.loading("Uploading evidence...", { id: qId });

    // Replace with your real Cloudinary upload later
    setTimeout(() => {
      const fakeUrl = `https://res.cloudinary.com/demo/image/upload/${file.name}`;
      setAnswers((prev) => ({
        ...prev,
        [qId]: { ...prev[qId], evidence: fakeUrl },
      }));
      toast.success("Evidence uploaded!", { id: qId });
    }, 1000);
  };

  const handleSaveProgress = async () => {
    const payload = {
      assessmentId: assainmetId!,
      answers: Object.entries(answers).map(([qId, ans]) => ({
        questionId: questions.find(q => q.id === qId)?.questionId.toString() || "",
        answer: ans.answer || "NOT_APPLICABLE",
        comments: ans.comments,
        evidence: ans.evidence,
      })),
    };

    try {
      await saveDraft(payload).unwrap();
      toast.success("Progress saved successfully!");
    } catch (err) {
      toast.error("Failed to save progress");
    }
  };

  const handleFinalSubmit = async () => {
    const answeredCount = Object.values(answers).filter(a => a?.answer && a.answer !== "NOT_APPLICABLE").length;

    if (answeredCount < totalQuestions) {
      toast.error(`Please answer all ${totalQuestions} questions before submitting`);
      return;
    }

    const payload = {
      assessmentId: assainmetId!,
      answers: questions.map(q => ({
        questionId: q.questionId.toString(),
        answer: answers[q.id]?.answer || "NOT_APPLICABLE",
        comments: answers[q.id]?.comments,
        evidence: answers[q.id]?.evidence,
      })),
    };

    try {
      await submitFinal(payload).unwrap();
      toast.success("Assessment submitted successfully!");
      navigate("/supplier/analytics");
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  const answeredCount = isSubmitted ? totalQuestions : Object.values(answers).filter(a => a?.answer && a.answer !== "NOT_APPLICABLE").length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  if (loadingAssessment || loadingDraft) {
    return <div className="p-12 text-center text-lg">Loading assessment...</div>;
  }

  if (!assessmentData?.data) {
    return <div className="p-12 text-center text-red-600">Assessment not found</div>;
  }

  // If assessment is submitted, show readonly view
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
          <div className="mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{assessmentData.data.title}</h1>
                <p className="text-muted-foreground mt-2">NIS2 Compliance Assessment - Submitted</p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate("/supplier/analytics")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <FileText className="w-4 h-4 mr-2" />
                  View Report
                </Button>
              </div>
            </div>

            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-800">Assessment Submitted Successfully!</h3>
                    <p className="text-green-700">
                      Submitted on: {new Date(currentSubmission.submittedAt).toLocaleDateString()} | 
                      Score: {currentSubmission.score}% | 
                      Risk Score: {currentSubmission.riskScore}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">{currentSubmission.score}%</p>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-6 py-10 space-y-12">
          {assessmentData.data.categories.map((category: any) => (
            <div key={category.id}>
              <h2 className="text-2xl font-semibold mb-8">{category.title}</h2>
              <div className="space-y-8">
                {category.questions.map((q: any, idx: number) => {
                  const submissionAnswer = submittedAnswers[q.id];
                  const answer = submissionAnswer?.answer;
                  const isYes = answer === "YES";
                  const isNo = answer === "NO";
                  const isPartial = answer === "PARTIAL";

                  return (
                    <Card key={q.id} className={`${
                      isYes ? "border-green-400 bg-green-50/50" :
                      isNo ? "border-red-400 bg-red-50/50" :
                      isPartial ? "border-yellow-400 bg-yellow-50/50" :
                      "border-gray-200"
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          {isYes ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                          ) : isNo ? (
                            <Circle className="w-6 h-6 text-red-600 mt-1" />
                          ) : isPartial ? (
                            <Circle className="w-6 h-6 text-yellow-600 mt-1" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 mt-1" />
                          )}
                          <div>
                            <p className="font-semibold text-lg">
                              {idx + 1}. {q.question}
                            </p>
                            {answer && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  isYes ? "bg-green-100 text-green-800" :
                                  isNo ? "bg-red-100 text-red-800" :
                                  isPartial ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  Answer: {answer}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {submissionAnswer?.comments && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">Comments:</h4>
                            <p className="text-gray-600">{submissionAnswer.comments}</p>
                          </div>
                        )}

                        {submissionAnswer?.evidence && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-blue-700">Uploaded Evidence:</h4>
                              </div>
                              <a 
                                href={submissionAnswer.evidence} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                              >
                                View Document
                              </a>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-12 border-t">
            <Link to="/supplier/analytics">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Return to Analytics Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normal assessment view (not submitted yet)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className=" mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold">{assessmentData.data.title}</h1>
          <p className="text-muted-foreground mt-2">NIS2 Compliance Assessment</p>

          <div className="mt-8">
            <div className="flex justify-between mb-3">
              <span className="text-lg font-medium">Progress</span>
              <span className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center mt-3 text-sm text-muted-foreground">
              {answeredCount} / {totalQuestions} questions answered
            </p>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-6 py-10 space-y-12">
        {assessmentData.data.categories.map((category: any) => (
          <div key={category.id}>
            <h2 className="text-2xl font-semibold mb-8">{category.title}</h2>
            <div className="space-y-8">
              {category.questions.map((q: any, idx: number) => {
                const qId = q.id;
                const userAnswer = answers[qId];
                const isAnswered = !!userAnswer?.answer && userAnswer.answer !== "NOT_APPLICABLE";

                return (
                  <Card key={qId} className={`${isAnswered ? "border-green-400 bg-green-50/50" : ""}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        {isAnswered ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 mt-1" />
                        )}
                        <div>
                          <p className="font-semibold text-lg">
                            {idx + 1}. {q.question}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <RadioGroup
                        value={userAnswer?.answer || ""}
                        onValueChange={(v) => handleAnswerChange(qId, v)}
                      >
                        <div className="flex flex-wrap gap-8">
                          {["YES", "NO", "PARTIAL"].map((opt) => (
                            <div key={opt} className="flex items-center gap-3">
                              <RadioGroupItem value={opt} id={`${qId}-${opt}`} />
                              <Label htmlFor={`${qId}-${opt}`} className="cursor-pointer font-medium">
                                {opt}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>

                      {q.isInputField && (
                        <Textarea
                          placeholder="Add explanation or comments..."
                          value={userAnswer?.comments || ""}
                          onChange={(e) => handleCommentChange(qId, e.target.value)}
                        />
                      )}

                      {q.isDocument && (
                        <div>
                          {userAnswer?.evidence ? (
                            <div className="p-4 bg-green-50 border border-green-300 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <a href={userAnswer.evidence} target="_blank" className="text-blue-600 underline">
                                  View uploaded evidence
                                </a>
                              </div>
                            </div>
                          ) : (
                            <label className="block">
                              <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
                                <Upload className="w-full h-3 mx-auto text-gray-400 mb-3" />
                                <p>Click to upload evidence</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                onChange={(e) => handleFileUpload(qId, e.target.files?.[0] || null)}
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-12 border-t">
          <Button onClick={handleSaveProgress} disabled={saving} variant="outline" size="lg">
            {saving ? "Saving..." : "Save Progress"}
          </Button>
          <Button
            onClick={handleFinalSubmit}
            disabled={submitting || progress < 100}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            {submitting ? "Submitting..." : "Submit Assessment"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {progress < 100 && (
          <p className="text-center text-orange-600 font-medium">
            Complete all questions to submit final assessment
          </p>
        )}
      </div>
    </div>
  );
}