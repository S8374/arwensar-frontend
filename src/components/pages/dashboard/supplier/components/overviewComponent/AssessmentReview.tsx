// src/components/pages/dashboard/supplier/assessments/CompletedAssessmentReview.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, FileText } from "lucide-react";

export default function AssessmentReview() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-background border-b">
                <div className=" mx-auto px-6 py-8">
                    <h1 className="text-2xl font-bold text-foreground">Data Security Assessment</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Completed and reviewed assessment details
                    </p>
                </div>
            </div>

            <div className=" mx-auto px-6 py-8 space-y-8">
                {/* Assessment Status Card */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-semibold">Assessment Status</h2>
                                    <Badge className="bg-background text-foreground border">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                        Completed
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Assessment Type</p>
                                        <p className="font-medium">Initial Assessment</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Submitted Date</p>
                                        <p className="font-medium">January 10, 2024</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Reviewed By</p>
                                        <p className="font-medium">Sarah Johnson</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Review Date</p>
                                        <p className="font-medium">January 12, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions & Responses */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">Questions & Responses</h2>

                    <div className="space-y-8">
                        {/* Section: Data Protection */}
                        <div>
                            <h3 className="text-lg font-medium text-chart-6 mb-5">Data Protection</h3>

                            {/* Question 1 */}
                            <Card className="border-0 bg-gray-50/50">
                                <CardContent className="pt-5 pb-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-foreground mt-0.5 shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <p className="font-medium">
                                                Do you have a documented data protection policy that covers personal data processing?
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-foreground">Answer:</span> Yes
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium">Notes:</span> Updated policy approved in Q4 2023
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Badge variant="secondary" className="text-xs">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    policy-v2.pdf
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    gdpr-compliance-doc.pdf
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Question 2 */}
                            <Card className="border-0 bg-ring mt-4">
                                <CardContent className="pt-5 pb-6">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <p className="font-medium">
                                                Are all employees trained on data protection and GDPR compliance?
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-destructive">Answer:</span> Partial
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="font-medium">Notes:</span> Training completed for 85% of staff, remaining scheduled for Q1 2024
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Badge variant="secondary" className="text-xs">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    training-records-2023.xlsx
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                     
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-8 border-t">
                    <Button variant="outline" size="lg">
                        Download Report
                    </Button>
                </div>
            </div>
        </div>
    );
}