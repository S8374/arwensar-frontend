// components/assessment/AssessmentHistory.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Assessment {
  supplierId: any;
  id: number;
  date: string;
  isLatest: boolean;
  score: number;
  riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
  status: "Compliant" | "Partial" | "Non-Compliant";
  notes: string;
  assessmentId?: string; // Add this if needed for navigation
  reviewerReport?: any;
}

interface AssessmentHistoryProps {
  supplyer: any; // Replace with proper Supplier type later
}

const getRiskBadge = (level: Assessment["riskLevel"]) => {
  const styles = {
    "Low Risk": "bg-green-100 text-green-700",
    "Medium Risk": "bg-amber-100 text-amber-700",
    "High Risk": "bg-red-100 text-red-700",
  };
  return styles[level];
};

const getStatusIcon = (status: Assessment["status"]) => {
  switch (status) {
    case "Compliant":
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case "Partial":
      return <Clock className="w-4 h-4 text-amber-600" />;
    case "Non-Compliant":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
  }
};

export default function AssessmentHistory({ supplyer }: AssessmentHistoryProps) {
  const navigate = useNavigate();
  const submitedAssainment = supplyer?.data?.assessmentSubmissions;
  console.log("Submit.................",submitedAssainment)
  // Remove the mock data at the top — it's unused now
  // Transform real data into Assessment format
  const assessments: Assessment[] = submitedAssainment?.map((a: any, index: number) => {
    const totalQuestions = a.totalQuestions || 0;
    const answeredQuestions = a.answers?.length || 0;

    let status: "Compliant" | "Partial" | "Non-Compliant" = "Partial" ;
    if (answeredQuestions === totalQuestions && totalQuestions > 0) {
      status = "Compliant";
    } else if (answeredQuestions === 0) {
      status = "Non-Compliant";
    }

    const riskLevel =
      a.riskScore < 50
        ? "Low Risk"
        : a.riskScore < 80
          ? "Medium Risk"
          : "High Risk";

    return {
      id: index + 1,
      date: new Date(a.submittedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      isLatest: index === 0,
      score: a.score ?? 0,
      riskLevel,
      status,
      notes: `Total Questions: ${totalQuestions}, Answers Submitted: ${answeredQuestions}`,
      assessmentId: a.assessment.id || a._id, // assuming your submission has an ID
      reviewerReport: a.reviewerReport,
      supplierId:a.supplierId
    };
  }) ?? [];
  console.log("assainments..........", assessments);
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Assessment History</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Changes in Confidentiality, Integrity, and Availability scores
        </p>
      </div>

      {/* Assessment Cards */}
      <div className="space-y-4">
        {assessments.map((assessment: Assessment) => (
          <Card
            key={assessment.id}
            className="overflow-hidden border-0 bg-muted/30 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {assessment.date}
                    </h3>
                    {assessment.isLatest && (
                      <Badge variant="secondary" className="text-xs">
                        Latest
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Score:</span>
                        <span className="font-bold text-foreground">
                          {assessment.score}/100
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Risk:</span>
                        <Badge className={getRiskBadge(assessment.riskLevel)}>
                          {assessment.riskLevel === "Low Risk" && (
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-1" />
                          )}
                          {assessment.riskLevel === "Medium Risk" && (
                            <div className="w-2 h-2 bg-amber-600 rounded-full mr-1" />
                          )}
                          {assessment.riskLevel === "High Risk" && (
                            <div className="w-2 h-2 bg-red-600 rounded-full mr-1" />
                          )}
                          {assessment.riskLevel}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status:</span>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(assessment.status)}
                          <span className="font-medium">{assessment.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-muted-foreground">
                      <span className="font-medium">Notes:</span> {assessment.notes}
                    </div>
                  </div>
                </div>

                {/* Right Side - Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() =>
                      navigate(`/vendor/assainment/${assessment.supplierId}/${assessment.assessmentId}`)
                    }
                  >
                    View Details
                  </Button>

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optional: Load More */}
      {assessments.length > 2 && (
        <div className="text-center">
          <Button variant="ghost">Load More Assessments</Button>
        </div>
      )}
    </div>
  );
}