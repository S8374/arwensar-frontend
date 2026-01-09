/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/supplier-detail/components/RiskMetrics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, Calendar, AlertCircle } from "lucide-react";

interface RiskMetricsProps {
  supplier: any;
}

export default function RiskMetrics({ supplier }: RiskMetricsProps) {
  const overallScore = Number(supplier?.overallScore) || 0;
  const riskLevel = supplier?.riskLevel || "Not Assessed";
  const businessScore = Number(supplier?.businessScore) || 0;
  const integrityScore = Number(supplier?.integrityScore) || 0;
  const availabilityScore = Number(supplier?.availabilityScore) || 0;
  const bivScore = Number(supplier?.bivScore) || 0;
  const lastAssessmentDate = supplier?.lastAssessmentDate;
  const criticality = supplier?.criticality || "Not Set";

  // Calculate weighted BIV if not provided
  const calculatedBIV = businessScore || integrityScore || availabilityScore
    ? Math.round(businessScore * 0.4 + integrityScore * 0.3 + availabilityScore * 0.3)
    : 0;

  const displayBIVScore = bivScore > 0 ? bivScore : calculatedBIV;

  // Badge variants
  const riskBadgeVariant = 
    riskLevel.toUpperCase() === "HIGH" || riskLevel.toUpperCase() === "CRITICAL"
      ? "destructive"
      : riskLevel.toUpperCase() === "MEDIUM"
      ? "secondary"
      : riskLevel.toUpperCase() === "LOW"
      ? "success"
      : "outline";

  const criticalityVariant = criticality === "HIGH" ? "destructive" : "secondary";

  // Progress and text color based on score
  const getProgressColor = (score: number) =>
    score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";

  const getTextColor = (score: number) =>
    score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-600";

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "No assessment yet";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/40 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="w-6 h-6 text-primary" />
          Risk Assessment
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        {/* Overall Risk Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall  Score</p>
              <p className={`text-4xl font-bold ${getTextColor(overallScore)}`}>
                {overallScore}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={riskBadgeVariant} className="text-sm px-4 py-1.5">
                {riskLevel.toUpperCase()} RISK
              </Badge>
              {riskLevel.toUpperCase().includes("HIGH") || riskLevel.toUpperCase().includes("CRITICAL") && (
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mt-3" />
              )}
            </div>
          </div>

          <Progress
            value={overallScore}
            className={`h-3 [&>div]:${getProgressColor(overallScore)}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>High Risk</span>
            <span>Low Risk</span>
          </div>
        </div>

        <Separator />

        {/* BIV Breakdown */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">BIV Score Breakdown</h3>
            <div className="text-right">
              <p className="text-3xl font-bold">{displayBIVScore}</p>
              <p className="text-sm text-muted-foreground">Weighted Average</p>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { label: "Business Impact", score: businessScore },
              { label: "Integrity & Compliance", score: integrityScore },
              { label: "Availability & Resilience", score: availabilityScore },
            ].map(({ label, score }) => (
              <div key={label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{label}</span>
                  <span className={`font-bold text-lg ${getTextColor(score)}`}>
                    {score}
                  </span>
                </div>
                <Progress
                  value={score}
                  className={`h-2.5 [&>div]:${getProgressColor(score)}`}
                />
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
            <p className="font-medium">BIV Calculation:</p>
            <p>(Business × 40%) + (Integrity × 30%) + (Availability × 30%)</p>
          </div>
        </div>

        <Separator />

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Last Assessment</p>
              <p className="font-medium">{formatDate(lastAssessmentDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Supplier Criticality</p>
              <Badge variant={criticalityVariant} className="mt-1">
                {criticality.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}