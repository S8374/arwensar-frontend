import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, CheckCircle2, Circle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllAssainmentQuery } from "@/redux/features/vendor/vendor.api";
import {
  useGetDrafAssainmentByAssainmentIDQuery,
  useSaveDarftAssainmentMutation,
  useSubmitAssessmentMutation,
} from "@/redux/features/supplyer/supplyer.api";
import { useCloudinaryUpload } from "@/lib/useCloudinaryUpload";

const ASSESSMENT_ID = "5501d843-b718-4b4a-a3e5-40c57b62fe51";

export default function SupplierAssignmentForm() {
  const navigate = useNavigate();
  const { data: userData, isLoading: loadingUser } = useUserInfoQuery(undefined);
  const { data: allAssignments } = useGetAllAssainmentQuery(undefined);
  
  // Critical: Skip draft query until we know supplier is loaded
  const supplierId = userData?.data?.supplier?.id;
  const { data: draftResponse, isLoading: loadingDraft } = useGetDrafAssainmentByAssainmentIDQuery(
    ASSESSMENT_ID,
    { skip: !supplierId }
  );

  const [saveDraft, { isLoading: saving }] = useSaveDarftAssainmentMutation();
  const [submitFinal, { isLoading: submitting }] = useSubmitAssessmentMutation();
  const { uploadFile } = useCloudinaryUpload();

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const assignment = allAssignments?.data?.data?.find((a: any) => a.id === ASSESSMENT_ID);
  const questions = useMemo(() => assignment?.categories?.[0]?.questions || [], [assignment]);

  const hasSubmitted = userData?.data?.supplier?.assessmentSubmissions?.some(
    (sub: any) => sub.assessmentId === ASSESSMENT_ID && sub.status === "PENDING"
  );

  // Load draft answers when draft data arrives
  useEffect(() => {
    if (draftResponse?.data && draftResponse.data.status === "DRAFT") {
      const formatted: Record<string, any> = {};
      
      draftResponse.data.answers.forEach((a: any) => {
        formatted[a.question.questionId] = {
          answer: a.answer,
          comments: a.comments || "",
          evidence: a.evidence || undefined,
        };
      });

      setAnswers(formatted);
      //toast.success("Draft loaded successfully!");
    }
  }, [draftResponse]);

  // Early loading or redirect
  if (loadingUser || loadingDraft) {
    return <div className="p-12 text-center">Loading your progress...</div>;
  }

  if (hasSubmitted) {
    return <Navigate to="/supplier/analytics" replace />;
  }

  if (!assignment || questions.length === 0) {
    return <div className="p-12 text-center">Assessment not found</div>;
  }

  // File upload with toast
  const handleFileChange = async (qId: string, file: File | null) => {
    if (!file) return;

    toast.loading("Uploading file...", { id: qId });

    try {
      const url = await uploadFile(file);
      setAnswers(prev => ({
        ...prev,
        [qId]: { ...prev[qId], evidence: url },
      }));
      toast.success("File uploaded!", { id: qId });
    } catch (err) {
      toast.error("Upload failed", { id: qId });
    }
  };

  const handleOptionChange = (qId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], answer: value },
    }));
  };

  const handleTextChange = (qId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], comments: value },
    }));
  };

  const removeFile = (qId: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], evidence: undefined },
    }));
    toast.success("File removed");
  };

  // Save Draft
  const handleSaveProgress = async () => {
    const payload = {
      assessmentId: ASSESSMENT_ID,
      answers: questions.map((q: any) => {
        const a = answers[q.questionId] || {};
        return {
          questionId: q.questionId.toString(),
          answer: a.answer || "NOT_APPLICABLE",
          comments: a.comments || "",
          evidence: a.evidence,
        };
      }),
    };

    try {
      await saveDraft(payload).unwrap();
      toast.success("Progress saved successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save draft");
    }
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    const answered = Object.values(answers).filter(
      (a: any) => a?.answer && a.answer !== "NOT_APPLICABLE"
    ).length;

    if (answered < questions.length) {
      toast.error(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    const payload = {
      assessmentId: ASSESSMENT_ID,
      answers: questions.map((q: any) => {
        const a = answers[q.questionId] || {};
        return {
          questionId: q.questionId.toString(),
          answer: a.answer,
          comments: a.comments || "",
          evidence: a.evidence,
        };
      }),
    };

    try {
      await submitFinal(payload).unwrap();
      toast.success("Assessment submitted successfully!");
      navigate("/supplier/analytics");
    } catch (err: any) {
      toast.error(err?.data?.message || "Submission failed");
    }
  };

  // Progress calculation
  const answeredCount = Object.values(answers).filter(
    (a: any) => a?.answer && a.answer !== "NOT_APPLICABLE"
  ).length;

  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between text-sm mb-2 font-semibold text-gray-700">
            <span>Assessment Progress</span>
            <span className="text-green-600">{answeredCount} / {questions.length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 20 && (
                <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
              )}
            </div>
          </div>
          {progress === 100 && (
            <p className="text-sm text-green-600 mt-2 font-medium">All questions answered — Ready to submit!</p>
          )}
        </div>

        <div className="space-y-8">
          {questions.map((q: any, idx: number) => {
            const qId = q.questionId.toString();
            const current = answers[qId] || {};
            const isAnswered = !!current.answer && current.answer !== "NOT_APPLICABLE";

            return (
              <Card key={qId} className={`border ${isAnswered ? "border-green-300 bg-green-50/30" : "border-gray-200"}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {isAnswered ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <Label className="text-lg font-medium">
                        {idx + 1}. {q.question}
                      </Label>

                      {/* Radio Options */}
                      <div className="flex flex-wrap gap-6 mt-5">
                        {["YES", "NO", "PARTIAL"].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={qId}
                              checked={current.answer === opt}
                              onChange={() => handleOptionChange(qId, opt)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className={`font-medium ${current.answer === opt ? "text-blue-600" : "text-gray-700"}`}>
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Comments Field */}
                      {q.isInputField && (
                        <div className="mt-6">
                          <Label>Comments / Explanation</Label>
                          <Textarea
                            placeholder="Provide details or justification..."
                            className="mt-2 min-h-28"
                            value={current.comments || ""}
                            onChange={(e) => handleTextChange(qId, e.target.value)}
                          />
                        </div>
                      )}

                      {/* Document Upload */}
                      {q.isDocument && (
                        <div className="mt-6">
                          <Label>Supporting Document</Label>
                          {current.evidence ? (
                            <div className="flex items-center gap-4 mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <a
                                href={current.evidence}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-2"
                              >
                                <Upload className="w-4 h-4" />
                                View Uploaded File
                              </a>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeFile(qId)}
                              >
                                <X className="w-4 h-4" /> Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-2">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={(e) => handleFileChange(qId, e.target.files?.[0] || null)}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-12 pb-10">
          <Button
            onClick={handleSaveProgress}
            disabled={saving || progress === 0}
            size="lg"
            variant="outline"
            className="px-8"
          >
            {saving ? "Saving..." : "Save Progress"}
          </Button>

          <Button
            onClick={handleFinalSubmit}
            disabled={submitting || progress < 100}
            size="lg"
            className="px-8 bg-green-600 hover:bg-green-700"
          >
            {submitting ? "Submitting..." : "Submit Final Assessment"}
          </Button>
        </div>
      </div>
    </div>
  );
}