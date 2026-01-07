/* eslint-disable react-hooks/use-memo */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/DataSecurityAssessment.tsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle2, Circle, AlertCircle, Loader2, ChevronRight, FileText, Trash2, Edit3, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { 
  useGetAssessmentByIdQuery, 
  useSaveAnswerMutation, 
  useStartAssessmentMutation, 
  useSubmitAssessmentMutation,
  useRemoveEvidenceMutation,
} from "@/redux/features/assainment/assainment.api";
import { useMinioUpload } from "@/lib/useMinioUpload";
import debounce from "lodash/debounce";

export default function DataSecurityAssessment() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const { data: assessmentData, isLoading: loadingAssessment } = useGetAssessmentByIdQuery(assessmentId!);
  const [startAssessment, { isLoading: starting }] = useStartAssessmentMutation();
  const [submitAssessment, { isLoading: submitting }] = useSubmitAssessmentMutation();
  const [removeEvidence, { isLoading: removingEvidence }] = useRemoveEvidenceMutation();
  const { uploadFile, isUploading, uploadProgress } = useMinioUpload();

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [answerIds, setAnswerIds] = useState<Record<string, string>>({});
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({});
  const [savingQuestions, setSavingQuestions] = useState<Record<string, boolean>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, boolean>>({});
  const [lastSavedTime, setLastSavedTime] = useState<Record<string, Date>>({});

  const assessment = assessmentData?.data;
  const userSubmission = assessment?.userSubmission;

  // Allow editing if status is DRAFT, REJECTED, or REQUIRES_ACTION
  const isEditable = userSubmission && 
    ["DRAFT", "REJECTED", "REQUIRES_ACTION"].includes(userSubmission.status);

  // Initialize answers from server data
  useEffect(() => {
    if (userSubmission?.answers) {
      const saved: Record<string, any> = {};
      const ids: Record<string, string> = {};
      const local: Record<string, any> = {};
      
      userSubmission.answers.forEach((ans: any) => {
        saved[ans.question.id] = {
          answer: ans.answer || "",
          comments: ans.comments || "",
          evidence: ans.evidence || null,
          answerId: ans.id,
        };
        ids[ans.question.id] = ans.id;
        local[ans.question.id] = {
          answer: ans.answer || "",
          comments: ans.comments || "",
          evidence: ans.evidence || null,
          answerId: ans.id,
        };
      });
      
      setAnswers(saved);
      setAnswerIds(ids);
      setLocalAnswers(local);
      setSubmissionId(userSubmission.id);
    }
  }, [userSubmission]);

  const handleStartAssessment = async () => {
    try {
      const result = await startAssessment({ assessmentId: assessmentId! }).unwrap();
      setSubmissionId(result.id);
      toast.success("Assessment started!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start");
    }
  };

  // Custom save answer hook with per-question loading
  const useSaveAnswerWithState = () => {
    const [saveAnswerMutation] = useSaveAnswerMutation();

    const saveAnswer = async (questionId: string, data: any) => {
      if (!submissionId || !isEditable) return;

      // Set saving state for this specific question
      setSavingQuestions(prev => ({ ...prev, [questionId]: true }));

      try {
        await saveAnswerMutation({
          submissionId,
          questionId,
          body: data
        }).unwrap();

        // Update server answers state
        setAnswers(prev => ({ ...prev, [questionId]: data }));
        
        // Clear unsaved changes
        setUnsavedChanges(prev => ({ ...prev, [questionId]: false }));
        
        // Update last saved time
        setLastSavedTime(prev => ({ ...prev, [questionId]: new Date() }));
        
        // Clear saving state after a short delay for better UX
        setTimeout(() => {
          setSavingQuestions(prev => ({ ...prev, [questionId]: false }));
        }, 500);

      } catch (err) {
        setSavingQuestions(prev => ({ ...prev, [questionId]: false }));
        toast.error("Save failed");
      }
    };

    return { saveAnswer };
  };

  const { saveAnswer } = useSaveAnswerWithState();

  // Debounced save function for auto-save (only for radio buttons)
  const debouncedSave = useCallback(
    debounce(async (questionId: string, data: any) => {
      await saveAnswer(questionId, data);
    }, 800), // 800ms delay for auto-save
    [submissionId, isEditable]
  );

  const handleRadioChange = (questionId: string, value: string) => {
    if (!isEditable) return;

    // Update local state immediately for responsive UI
    setLocalAnswers(prev => {
      const current = prev[questionId] || {};
      const updated = { ...current, answer: value };
      return { ...prev, [questionId]: updated };
    });

    // Prepare data for saving
    const currentData = answers[questionId] || {};
    const newData = { ...currentData, answer: value };

    // Trigger debounced save (auto-save for radio buttons)
    debouncedSave(questionId, newData);
  };

  const handleTextChange = (questionId: string, value: string) => {
    if (!isEditable) return;

    // Update local state immediately
    setLocalAnswers(prev => {
      const current = prev[questionId] || {};
      const updated = { ...current, comments: value };
      return { ...prev, [questionId]: updated };
    });

    // Mark as unsaved for text fields
    setUnsavedChanges(prev => ({ ...prev, [questionId]: true }));
  };

  const handleManualSave = async (questionId: string) => {
    if (!isEditable) return;

    const localAnswer = localAnswers[questionId] || {};
    const currentData = answers[questionId] || {};
    const newData = { ...currentData, comments: localAnswer.comments || "" };
    
    await saveAnswer(questionId, newData);
  };

  const handleEvidenceUpload = async (questionId: string, file: File) => {
    if (!isEditable) return;

    // Set saving state for this question
    setSavingQuestions(prev => ({ ...prev, [questionId]: true }));

    try {
      const url = await uploadFile(file);
      
      // Update local state immediately
      setLocalAnswers(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], evidence: url }
      }));

      // Prepare data for saving
      const currentData = answers[questionId] || {};
      const newData = { ...currentData, evidence: url };
      
      await saveAnswer(questionId, newData);
      
      toast.success("File uploaded successfully!");
    } catch {
      setSavingQuestions(prev => ({ ...prev, [questionId]: false }));
      toast.error("Upload failed");
    }
  };

  const handleRemoveEvidence = async (questionId: string) => {
    const answerId = answerIds[questionId];
    if (!answerId || !isEditable) {
      toast.error("Cannot find answer ID");
      return;
    }

    // Set saving state
    setSavingQuestions(prev => ({ ...prev, [questionId]: true }));

    try {
      await removeEvidence({ answerId }).unwrap();
      
      // Update local state
      setLocalAnswers(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], evidence: null }
      }));

      // Update server state
      setAnswers(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], evidence: null }
      }));
      
      // Clear saving state
      setTimeout(() => {
        setSavingQuestions(prev => ({ ...prev, [questionId]: false }));
      }, 500);
      
      toast.success("Evidence removed successfully!");
    } catch (err: any) {
      setSavingQuestions(prev => ({ ...prev, [questionId]: false }));
      toast.error(err?.data?.message || "Failed to remove evidence");
    }
  };

  const handleSubmit = async () => {
    if (!submissionId || !isEditable) return;
    
    // Check if there are unsaved text changes
    const hasUnsavedChanges = Object.keys(unsavedChanges).some(key => unsavedChanges[key]);
    if (hasUnsavedChanges) {
      toast.error("Please save all text answers before submitting");
      return;
    }

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
  const answeredCount = Object.values(localAnswers).filter(a => a?.answer).length;
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const canSubmit = progress === 100 && submissionId && isEditable && !Object.values(unsavedChanges).some(v => v);

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
          const userAnswer = localAnswers[question.id] || { answer: "", comments: "", evidence: null };
          const isAnswered = !!userAnswer.answer;
          const isSaving = savingQuestions[question.id];
          const hasUnsavedText = unsavedChanges[question.id];
          const savedTime = lastSavedTime[question.id];
          const isRecentlySaved = savedTime && (new Date().getTime() - savedTime.getTime()) < 3000;

          return (
            <Card key={question.id} className={`transition-all relative ${isAnswered ? "border-l-4 border-l-green-500" : ""}`}>
              {/* Status Indicators */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                {/* Recently saved indicator */}
                {isRecentlySaved && !isSaving && !hasUnsavedText && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm animate-fade-in-out">
                    <Check className="w-3 h-3" />
                    <span>Saved</span>
                  </div>
                )}
                
                {/* Saving indicator */}
                {isSaving && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </div>
                )}
                
                {/* Unsaved changes indicator */}
                {hasUnsavedText && !isSaving && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                    <AlertCircle className="w-3 h-3" />
                    <span>Unsaved</span>
                  </div>
                )}
              </div>

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
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">Select Answer</Label>
                    {isSaving && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Auto-saving...
                      </div>
                    )}
                  </div>
                  <RadioGroup
                    value={userAnswer.answer}
                    onValueChange={(value) => handleRadioChange(question.id, value)}
                    disabled={!isEditable || isSaving}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["YES", "PARTIAL", "NO", "NOT_APPLICABLE"].map((opt) => (
                        <div key={opt} className={`flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-all ${userAnswer.answer === opt ? 'bg-blue-50 border-blue-300' : ''}`}>
                          <RadioGroupItem value={opt} id={`${question.id}-${opt}`} />
                          <Label htmlFor={`${question.id}-${opt}`} className="cursor-pointer font-medium">
                            {opt.replace("_", " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Comments - With manual save button */}
                {question.isInputField && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Your Explanation</Label>
                      <div className="flex items-center gap-3">
                        {/* Last saved time */}
                        {savedTime && !hasUnsavedText && !isSaving && (
                          <span className="text-xs text-gray-500">
                            Last saved: {savedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        
                        {/* Save button */}
                        <Button
                          size="sm"
                          variant={hasUnsavedText ? "default" : "outline"}
                          onClick={() => handleManualSave(question.id)}
                          disabled={!hasUnsavedText || isSaving || !localAnswers[question.id]?.comments}
                          className="gap-2"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : hasUnsavedText ? (
                            <Save className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          {isSaving ? "Saving..." : hasUnsavedText ? "Save" : "Saved"}
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Provide detailed explanation..."
                      value={userAnswer.comments || ""}
                      onChange={(e) => handleTextChange(question.id, e.target.value)}
                      className="min-h-40"
                      disabled={!isEditable}
                    />
                  </div>
                )}

                {/* Evidence Upload */}
                {(question.isDocument || question.evidenceRequired) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {question.evidenceRequired ? "Evidence Required" : "Supporting Document"}
                      </Label>
                      {isSaving && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Processing...
                        </div>
                      )}
                    </div>
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
                          disabled={removingEvidence || !isEditable || isSaving}
                          className="gap-2"
                        >
                          {removingEvidence || isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="block">
                        <div className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${isUploading ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500 hover:bg-blue-50'}`}>
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
                          disabled={isUploading || !isEditable || isSaving}
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
                        ? 'All questions have been saved. You can now re-submit.'
                        : `${totalQuestions - answeredCount} question(s) remaining.`
                      }
                    </p>
                    {Object.keys(unsavedChanges).filter(key => unsavedChanges[key]).length > 0 && (
                      <p className="text-sm text-amber-600 mt-2">
                        {Object.keys(unsavedChanges).filter(key => unsavedChanges[key]).length} unsaved text answer(s)
                      </p>
                    )}
                  </div>
                </div>

                {canSubmit ? (
                  <div className="space-y-4">
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      disabled={submitting || Object.values(savingQuestions).some(v => v)}
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