/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  useGetAssessmentByIdQuery,
  useSaveAnswerMutation,
  useStartAssessmentMutation,
  useSubmitAssessmentMutation,
} from "@/redux/features/assainment/assainment.api";

import QuestionCard from "./QuestionCard";

export default function DataSecurityAssessment() {
  const { assessmentId } = useParams<{ assessmentId: string }>();

  const { data, isLoading } = useGetAssessmentByIdQuery(assessmentId!);

  const [startAssessment, { isLoading: starting }] =
    useStartAssessmentMutation();
  const [saveAnswer] = useSaveAnswerMutation(); // Added isLoading from saveAnswer
  const [submitAssessment, { isLoading: submitting }] =
    useSubmitAssessmentMutation();

  const assessment = data?.data;
  const submission = assessment?.userSubmission;

  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null); // Track which question is saving
  
  const isEditable =
    submission &&
    ["DRAFT", "REJECTED", "REQUIRES_ACTION"].includes(submission.status);

  /* ================= INIT EXISTING SUBMISSION ================= */
  useEffect(() => {
    if (!submission) return;

    const map: any = {};
    const saved: any = {};

    submission.answers.forEach((a: any) => {
      map[a.question.id] = {
        answer: a.answer || "",
        comments: a.comments || "",
        evidence: a.evidence || null,
      };
      saved[a.question.id] = true;
    });

    setAnswers(map);
    setSavedMap(saved);
    setSubmissionId(submission.id);
  }, [submission]);

  /* ================= START ASSESSMENT ================= */
  const handleStartAssessment = async () => {
    try {
      const res = await startAssessment({ assessmentId: assessmentId ?? "" }).unwrap();

      setSubmissionId(res.submissionId);
      toast.success("Assessment started");
    } catch {
      toast.error("Failed to start assessment");
    }
  };

  /* ================= SAVE ANSWER ================= */
  const handleSave = async (questionId: string, payload: any) => {
    if (!submissionId) return;
    
    setSavingQuestionId(questionId); // Set the question ID that's being saved
    try {
      await saveAnswer({
        submissionId,
        questionId,
        body: payload,
      }).unwrap();

      setSavedMap((p) => ({ ...p, [questionId]: true }));
      setAnswers((p) => ({ ...p, [questionId]: payload }));

      toast.success("Answer saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSavingQuestionId(null); // Reset saving state
    }
  };

  const allQuestions =
    assessment?.categories?.flatMap((c: any) => c.questions) || [];

  const progress =
    allQuestions.length > 0
      ? Math.round(
        (Object.values(savedMap).filter(Boolean).length /
          allQuestions.length) *
        100
      )
      : 0;

  const canSubmit =
    submissionId &&
    isEditable &&
    Object.values(savedMap).length === allQuestions.length &&
    Object.values(savedMap).every(Boolean);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-8 py-8">
      {/* ================= HEADER ================= */}
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold">{assessment?.title}</h1>
          <p className="text-muted-foreground">
            {assessment?.description}
          </p>

          {submission && (
            <div className="pt-4">
              <Badge>{submission.status}</Badge>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* ================= START BUTTON ================= */}
      {!submissionId && (
        <Card>
          <CardContent className="text-center py-10">
            <Button
              size="lg"
              onClick={handleStartAssessment}
              disabled={starting}
            >
              {starting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting Assessment...
                </>
              ) : (
                "Start Assessment"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ================= PROGRESS ================= */}
      {submissionId && (
        <Card>
          <CardContent className="pt-6">
            <Progress value={progress} />
            <p className="text-center mt-2">
              {progress}% completed
            </p>
          </CardContent>
        </Card>
      )}

      {/* ================= QUESTIONS ================= */}
      {submissionId &&
        allQuestions.map((q: any, idx: number) => (
          <QuestionCard
            key={q.id}
            index={idx}
            question={q}
            initialValue={answers[q.id]}
            isEditable={isEditable}
            isSaving={savingQuestionId === q.id} // Pass saving state
            onSave={handleSave}
            onDirty={() =>
              setSavedMap((p) => ({ ...p, [q.id]: false }))
            }
          />
        ))}

      {/* ================= SUBMIT ================= */}
      {submissionId && isEditable && (
        <div className="text-center py-10">
          <Button
            size="lg"
            disabled={!canSubmit || submitting}
            onClick={() => submitAssessment({ submissionId })}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Assessment"
            )}
          </Button>

          {!canSubmit && (
            <p className="text-sm text-orange-600 mt-2">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Please save all questions before submitting
            </p>
          )}
        </div>
      )}
    </div>
  );
}