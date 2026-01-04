/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/DataSecurityAssessment.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle2, Circle, AlertCircle, Loader2, ChevronRight, FileText, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { 
  useGetAssessmentByIdQuery, 
  useSaveAnswerMutation, 
  useStartAssessmentMutation, 
  useSubmitAssessmentMutation,
  useRemoveEvidenceMutation,
} from "@/redux/features/assainment/assainment.api";
import { useMinioUpload } from "@/lib/useMinioUpload";

export default function DataSecurityAssessment() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const { data: assessmentData, isLoading: loadingAssessment, refetch: refetchAssessment } = useGetAssessmentByIdQuery(assessmentId!);
  const [startAssessment, { isLoading: starting }] = useStartAssessmentMutation();
  const [saveAnswer, { isLoading: saving }] = useSaveAnswerMutation();
  const [submitAssessment, { isLoading: submitting }] = useSubmitAssessmentMutation();
  const [removeEvidence, { isLoading: removingEvidence }] = useRemoveEvidenceMutation();
  const { uploadFile, isUploading, uploadProgress } = useMinioUpload();

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [answerIds, setAnswerIds] = useState<Record<string, string>>({});

  const assessment = assessmentData?.data;
  const userSubmission = assessment?.userSubmission;

  // Allow editing if status is DRAFT, REJECTED, or REQUIRES_ACTION
  const isEditable = userSubmission && 
    ["DRAFT", "REJECTED", "REQUIRES_ACTION"].includes(userSubmission.status);

  // Initialize answers
  useEffect(() => {
    if (userSubmission?.answers) {
      const saved: Record<string, any> = {};
      const ids: Record<string, string> = {};
      userSubmission.answers.forEach((ans: any) => {
        saved[ans.question.id] = {
          answer: ans.answer || "",
          comments: ans.comments || "",
          evidence: ans.evidence || null,
          answerId: ans.id,
        };
        ids[ans.question.id] = ans.id;
      });
      setAnswers(saved);
      setAnswerIds(ids);
      setSubmissionId(userSubmission.id);
    }
  }, [userSubmission]);

  const handleStartAssessment = async () => {
    try {
      const result = await startAssessment({ assessmentId: assessmentId! }).unwrap();
      setSubmissionId(result.id);
      toast.success("Assessment started!");
      refetchAssessment();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start");
    }
  };

  const handleSaveAnswer = async (questionId: string, update: Partial<any>) => {
    if (!submissionId || !isEditable) return;

    const current = answers[questionId] || {};
    const newData = { ...current, ...update };

    try {
      await saveAnswer({
        submissionId,
        questionId,
        body: newData
      }).unwrap();

      setAnswers(prev => ({ ...prev, [questionId]: newData }));
      toast.success("Answer saved!");
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const handleEvidenceUpload = async (questionId: string, file: File) => {
    try {
      const url = await uploadFile(file);
      await handleSaveAnswer(questionId, { evidence: url });
      toast.success("File uploaded successfully!");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleRemoveEvidence = async (questionId: string) => {
    const answerId = answerIds[questionId];
    if (!answerId) {
      toast.error("Cannot find answer ID");
      return;
    }

    try {
      await removeEvidence({ answerId }).unwrap();
      setAnswers(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], evidence: null }
      }));
      toast.success("Evidence removed successfully!");
      refetchAssessment();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove evidence");
    }
  };

  const handleSubmit = async () => {
    if (!submissionId) return;
    try {
      await submitAssessment({ submissionId }).unwrap();
      toast.success("Assessment re-submitted successfully!");
      navigate("/supplier");
    } catch (err: any) {
      toast.error(err?.data?.message || "Submit failed");
    }
  };

  const allQuestions = assessment?.categories?.flatMap((cat: any) =>
    cat.questions.map((q: any) => ({ ...q, categoryTitle: cat.title }))
  ) || [];

  const totalQuestions = allQuestions.length;
  const answeredCount = Object.values(answers).filter(a => a?.answer).length;
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const canSubmit = progress === 100 && submissionId && isEditable;

  if (loadingAssessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment) {
    return <div className="text-center py-20 text-2xl">Assessment not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className=" mx-auto space-y-8">
        {/* Header */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <h1 className="text-4xl font-bold mb-4">{assessment.title}</h1>
            <p className="text-lg text-muted-foreground">{assessment.description}</p>
            {userSubmission && ["REJECTED", "REQUIRES_ACTION"].includes(userSubmission.status) && (
              <Badge variant="destructive" className="mt-4 text-lg px-6 py-3">
                <AlertCircle className="w-5 h-5 mr-2" />
                {userSubmission.status === "REJECTED" ? "Rejected" : "Action Required"} - Please revise and re-submit
              </Badge>
            )}
          </CardHeader>
        </Card>

        {/* Progress */}
        <Card>
          <CardContent className="pt-8">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Progress</h2>
              <span className="text-3xl font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-5" />
            <p className="text-center mt-4 text-lg text-muted-foreground">
              {answeredCount} / {totalQuestions} answered
            </p>
          </CardContent>
        </Card>

        {/* Start Button */}
        {!submissionId && (
          <div className="text-center py-12">
            <Button size="lg" onClick={handleStartAssessment} disabled={starting}>
              {starting ? "Starting..." : "Start Assessment"}
            </Button>
          </div>
        )}

        {/* Questions - Only show if editable */}
        {submissionId && isEditable && allQuestions.map((question: any, idx: number) => {
          const userAnswer = answers[question.id] || { answer: "", comments: "", evidence: null };
          const isAnswered = !!userAnswer.answer;

          return (
            <Card key={question.id} className={`transition-all ${isAnswered ? "border-l-4 border-l-green-500" : ""}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  {isAnswered ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600 mt-1" />
                  ) : (
                    <Circle className="w-8 h-8 text-gray-400 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">
                        {idx + 1}. {question.question}
                      </h3>
                      {question.required && <Badge variant="destructive">Required</Badge>}
                    </div>
                    {question.description && (
                      <p className="text-muted-foreground mt-2">{question.description}</p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Answer Options */}
                <div>
                  <Label className="text-base font-medium mb-4 block">Select Answer</Label>
                  <RadioGroup
                    value={userAnswer.answer}
                    onValueChange={(value) => handleSaveAnswer(question.id, { answer: value })}
                    disabled={saving || !isEditable}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["YES", "PARTIAL", "NO", "NOT_APPLICABLE"].map((opt) => (
                        <div key={opt} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={opt} id={`${question.id}-${opt}`} />
                          <Label htmlFor={`${question.id}-${opt}`} className="cursor-pointer font-medium">
                            {opt.replace("_", " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Comments */}
                {question.isInputField && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Your Explanation</Label>
                    <Textarea
                      placeholder="Provide detailed explanation..."
                      value={userAnswer.comments}
                      onChange={(e) => handleSaveAnswer(question.id, { comments: e.target.value })}
                      className="min-h-40"
                      disabled={saving || !isEditable}
                    />
                  </div>
                )}

                {/* Evidence Upload */}
                {(question.isDocument || question.evidenceRequired) && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {question.evidenceRequired ? "Evidence Required" : "Supporting Document"}
                    </Label>
                    {userAnswer.evidence ? (
                      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <a href={userAnswer.evidence} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium underline block">
                              View Document
                            </a>
                            <p className="text-sm text-gray-600">Click to download/view</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveEvidence(question.id)}
                          disabled={removingEvidence || !isEditable}
                        >
                          {removingEvidence ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="block">
                        <div className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                          {isUploading ? (
                            <div className="space-y-4">
                              <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
                              <p>Uploading... {Math.round(uploadProgress)}%</p>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                              <p className="text-lg font-medium">Click to upload</p>
                              <p className="text-sm text-muted-foreground">PDF, Word, Images (Max 10MB)</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          onChange={(e) => e.target.files?.[0] && handleEvidenceUpload(question.id, e.target.files[0])}
                          disabled={isUploading || !isEditable}
                        />
                      </label>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Submit Section */}
        {submissionId && isEditable && (
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="pt-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${canSubmit ? 'bg-green-100' : 'bg-orange-100'}`}>
                    {canSubmit ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-orange-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold">
                      {canSubmit ? 'Ready to Re-Submit!' : 'Complete All Questions'}
                    </h3>
                    <p className="text-muted-foreground">
                      {canSubmit 
                        ? 'All questions have been updated. You can now re-submit.'
                        : `${totalQuestions - answeredCount} question(s) remaining.`
                      }
                    </p>
                  </div>
                </div>

                {canSubmit ? (
                  <div className="space-y-4">
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="text-xl px-16 py-6 bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          Re-Submitting...
                        </>
                      ) : (
                        <>
                          <Edit3 className="mr-3 h-6 w-6" />
                          Re-Submit Assessment
                          <ChevronRight className="ml-3 h-6 w-6" />
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Your previous submission was rejected. Make improvements and re-submit.
                    </p>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-100 rounded-full">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-700">
                      {totalQuestions - answeredCount} questions remaining
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Only Mode */}
        {submissionId && !isEditable && (
          <Card className="border-t-4 border-t-gray-400">
            <CardContent className="pt-8 text-center">
              <Badge variant="secondary" className="text-lg px-6 py-3 mb-4">
                {userSubmission.status}
              </Badge>
              <p className="text-xl text-muted-foreground">
                This assessment has been {userSubmission.status.toLowerCase()}. You cannot edit it anymore.
              </p>
              {userSubmission.reviewComments && (
                <div className="mt-6 p-6 bg-muted rounded-lg max-w-2xl mx-auto">
                  <p className="font-medium mb-2">Vendor Feedback:</p>
                  <p className="text-muted-foreground italic">"{userSubmission.reviewComments}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}