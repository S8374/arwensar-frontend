/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/DataSecurityAssessment.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { CheckCircle2, Circle, AlertCircle, Loader2 } from "lucide-react";
import {
    useGetAssessmentByIdQuery,
} from "@/redux/features/assainment/assainment.api";
//{assainmentId}
export default function ReviewAssainment() {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    console.log("assainment Id", assessmentId)

    const { data: assessmentData, isLoading: loadingAssessment } = useGetAssessmentByIdQuery(assessmentId!);


    const [submissionId, setSubmissionId] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [, setAnswerIds] = useState<Record<string, string>>({}); // Store answer IDs for removal

    const assessment = assessmentData?.data;
    const userSubmission = assessment?.userSubmission;

    // Initialize saved answers with answer IDs
    useEffect(() => {
        if (userSubmission?.answers) {
            const saved: Record<string, any> = {};
            const ids: Record<string, string> = {};
            userSubmission.answers.forEach((ans: any) => {
                saved[ans.question.id] = {
                    answer: ans.answer || "",
                    comments: ans.comments || "",
                    evidence: ans.evidence || null,
                    answerId: ans.id, // Store the answer ID for removal
                };
                ids[ans.question.id] = ans.id;
            });
            setAnswers(saved);
            setAnswerIds(ids);
            setSubmissionId(userSubmission.id);
        }
    }, [userSubmission]);










    // Flatten questions
    const allQuestions = assessment?.categories?.flatMap((cat: any) =>
        cat.questions.map((q: any) => ({ ...q, categoryTitle: cat.title }))
    ) || [];

    const totalQuestions = allQuestions.length;
    const answeredCount = Object.values(answers).filter(a => a?.answer).length;
    const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;
    const canSubmit = progress === 100 && submissionId;

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



                {/* Questions */}
                {submissionId && allQuestions.map((question: any, idx: number) => {
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







                            </CardContent>
                        </Card>
                    );
                })}

                {/* Submit Section */}
                {submissionId && (
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
                                            {canSubmit ? 'Ready to Submit!' : 'Complete All Questions'}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {canSubmit
                                                ? 'All questions have been answered. Review your responses before submitting.'
                                                : `${totalQuestions - answeredCount} question(s) remaining to complete.`
                                            }
                                        </p>
                                    </div>
                                </div>


                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}