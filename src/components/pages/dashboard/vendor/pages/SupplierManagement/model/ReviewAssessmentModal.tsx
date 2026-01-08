/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/vendor/components/ReviewAssessmentModal.tsx
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    MessageSquare,
    FileText,
    ExternalLink,
    HelpCircle,
    AlertCircle,
    Upload,
} from "lucide-react";
import { useReviewAssessmentMutation } from "@/redux/features/assainment/assainment.api";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReviewAssessmentModalProps {
    submission: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const getAnswerVariant = (answer: string) => {
    switch (answer) {
        case "YES": return "bg-green-100 text-green-800 border-green-300";
        case "PARTIAL": return "bg-amber-100 text-amber-800 border-amber-300";
        case "NO": return "bg-red-100 text-red-800 border-red-300";
        default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
};

export default function ReviewAssessmentModal({
    submission,
    open,
    onOpenChange,
    onSuccess,
}: ReviewAssessmentModalProps) {
    const [reviewComments, setReviewComments] = useState("");
    const [reviewAssessment, { isLoading }] = useReviewAssessmentMutation();
    console.log("selected submission", submission);
    const handleReview = async (
        status: "APPROVED" | "REJECTED" | "REQUIRES_ACTION"
    ) => {
        try {
            const body: any = {
                status,
                reviewComments: reviewComments.trim() || undefined,
            };

            // ✅ ONLY send scores when APPROVED
            if (status === "APPROVED") {
                body.scores = {
                    overallScore: submission.score ?? 0,
                    bivScore: submission.bivScore ?? 0,
                    businessScore: submission.businessScore ?? 0,
                    integrityScore: submission.integrityScore ?? 0,
                    availabilityScore: submission.availabilityScore ?? 0,
                };
            }

            await reviewAssessment({
                submissionId: submission.assessmentId,
                body,
            }).unwrap();

            toast.success(`Assessment ${status.toLowerCase()} successfully`);
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to review assessment");
        }
    };
    ;

    if (!submission) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        Review Assessment Submission
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4 overflow-auto">
                    <div className="space-y-8 py-6">

                        {/* Header Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm text-muted-foreground">Assessment</Label>
                                <h3 className="text-xl font-bold">{submission.assessment.title}</h3>
                                <p className="text-muted-foreground">{submission.assessment.description}</p>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Supplier</Label>
                                    <p className="font-semibold">{submission.supplier.name}</p>
                                    <p className="text-sm text-muted-foreground">{submission.supplier.email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Submitted On</Label>
                                    <p className="font-medium">
                                        {new Date(submission.submittedAt).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Overall Scores */}
                        <Card className="bg-linear-to-r from-primary/5 to-primary/10">
                            <CardContent className="pt-6">
                                <h4 className="font-semibold text-lg mb-4">Overall Results</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {submission.score !== null && (
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Total Score</p>
                                            <p className="text-4xl font-bold text-primary">{submission.score}%</p>
                                        </div>
                                    )}
                                    {submission.bivScore !== null && (
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">BIV Score</p>
                                            <p className="text-4xl font-bold text-primary">{submission.bivScore}</p>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Risk Level</p>
                                        <Badge
                                            variant={
                                                submission.riskLevel === "LOW" ? "default" :
                                                    submission.riskLevel === "MEDIUM" ? "outline" : "destructive"
                                            }
                                            className="text-lg px-4 py-2"
                                        >
                                            {submission.riskLevel || "N/A"}
                                        </Badge>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Progress</p>
                                        <p className="text-4xl font-bold">{submission.progress}%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Separator />

                        {/* Detailed Answers */}
                        <div>
                            <h4 className="text-xl font-semibold mb-6 flex items-center gap-3">
                                <HelpCircle className="w-6 h-6" />
                                Supplier Answers ({submission.answers?.length || 0} questions)
                            </h4>

                            <div className="space-y-6">
                                {submission.answers?.map((ans: any, idx: number) => {
                                    const hasEvidence = !!ans.evidence;
                                    const evidencePending = ans.evidenceStatus === "PENDING";

                                    return (
                                        <Card key={ans.id} className="border-l-4 border-l-primary/50">
                                            <CardContent className="pt-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Question {idx + 1} • {ans.question.bivCategory}
                                                        </p>
                                                        <h5 className="font-semibold text-lg">{ans.question.question}</h5>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                                    {/* Answer */}
                                                    <div>
                                                        <Label className="text-sm font-medium">Answer</Label>
                                                        <div className={`mt-2 px-4 py-3 rounded-lg border font-semibold ${getAnswerVariant(ans.answer)}`}>
                                                            {ans.answer || "Not Answered"}
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <span className="text-sm text-muted-foreground">Score:</span>
                                                            <span className="font-bold text-lg">{ans.score}/{ans.maxScore}</span>
                                                        </div>
                                                    </div>

                                                    {/* Comments */}
                                                    <div>
                                                        <Label className="text-sm font-medium">Comments</Label>
                                                        {ans.comments ? (
                                                            <p className="mt-2 p-3 bg-muted rounded-lg text-sm">{ans.comments}</p>
                                                        ) : (
                                                            <p className="mt-2 text-sm text-muted-foreground italic">No comments provided</p>
                                                        )}
                                                    </div>

                                                    {/* Evidence */}
                                                    <div>
                                                        <Label className="text-sm font-medium flex items-center gap-2">
                                                            <Upload className="w-4 h-4" />
                                                            Evidence
                                                        </Label>
                                                        {hasEvidence ? (
                                                            <div className="mt-2 space-y-2">
                                                                <a
                                                                    href={ans.evidence}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 text-primary hover:underline"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    View Document
                                                                </a>
                                                                {evidencePending && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                                        Pending Review
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="mt-2 text-sm text-muted-foreground italic">No evidence uploaded</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        <Separator />

                        {/* Review Comments Input */}
                        <div className="space-y-3">
                            <Label htmlFor="comments" className="text-lg font-medium flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Your Review Comments (Optional)
                            </Label>
                            <Textarea
                                id="comments"
                                placeholder="Provide feedback, suggestions, or reasons for your decision..."
                                value={reviewComments}
                                onChange={(e) => setReviewComments(e.target.value)}
                                rows={5}
                                className="resize-none"
                            />
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        size="lg"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => handleReview("REJECTED")}
                        disabled={isLoading}
                        size="lg"
                    >
                        <XCircle className="w-5 h-5 mr-2" />
                        Reject
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => handleReview("REQUIRES_ACTION")}
                        disabled={isLoading}
                        size="lg"
                    >
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Requires Action
                    </Button>

                    <Button
                        onClick={() => handleReview("APPROVED")}
                        disabled={isLoading}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        {isLoading ? "Approving..." : "Approve"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}