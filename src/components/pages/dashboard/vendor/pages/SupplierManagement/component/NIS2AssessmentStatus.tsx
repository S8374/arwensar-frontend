// components/assessment/NIS2AssessmentStatus.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useGetAllAssainmentQuery } from "@/redux/features/vendor/vendor.api";

/* ------------------ Date Formatter ------------------ */
const getFormattedDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ------------------ Status Badge ------------------ */
const StatusBadge = ({
  totalQuestions,
  submissions,
}: {
  totalQuestions: number;
  submissions: number;
}) => {
  let statusConfig;

  if (submissions === 0) {
    statusConfig = {
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "Pending",
    };
  } else if (submissions < totalQuestions) {
    statusConfig = {
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "Partially Complete",
    };
  } else {
    statusConfig = {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "Complete",
    };
  }

  const { icon: Icon, color, bg, border, text } = statusConfig;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 px-3 py-1.5 ${bg} ${border} ${color} border`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{text}</span>
    </Badge>
  );
};

/* ------------------ Main Component ------------------ */
export default function NIS2AssessmentStatus({ supplyer }: any) {
  const { data: assainments, isLoading } =
    useGetAllAssainmentQuery(undefined);

  const assessments = assainments?.data?.data || [];

  if (isLoading) {
    return <p className="text-muted-foreground">Loading NIS2 assessments...</p>;
  }

  if (!assessments.length) {
    return <p className="text-muted-foreground">No assessments found.</p>;
  }

  return (
    <div className="w-full space-y-4">


      {/* Assessment Cards */}
      <div className="space-y-3">
        {assessments.map((item: any) => {
          // ✅ Match supplier submission with this assessment
          const supplierSubmission =
            supplyer?.data?.assessmentSubmissions?.find(
              (sub: any) => sub.assessmentId === item.id
            );

          // ✅ REAL backend values
          const totalQuestions =
            supplierSubmission?.totalQuestions || 0;

          const submissions =
            supplierSubmission?.answeredQuestions || 0;

          const lastAssessed = supplierSubmission?.updatedAt
            ? getFormattedDate(supplierSubmission.updatedAt)
            : "Not Yet Assessed";

          return (
            <Card
              key={item.id}
              className="overflow-hidden transition-all hover:shadow-md border-0 bg-muted/30"
            >
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-foreground text-base">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Last assessed: {lastAssessed}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Answered Questions: {submissions} / {totalQuestions}
                  </p>
                </div>

                <div className="text-right">
                  <StatusBadge
                    totalQuestions={totalQuestions}
                    submissions={submissions}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
