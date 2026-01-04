/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/supplier-detail/components/RiskMetrics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle } from "lucide-react";

interface RiskMetricsProps {
  supplier: any;
}

export default function RiskMetrics({ supplier }: RiskMetricsProps) {
  // Extract relevant data directly from supplier object
  const overallScore = Number(supplier?.overallScore) || 0;
  const riskLevel = supplier?.riskLevel || "Not Assessed";
  const businessScore = Number(supplier?.businessScore) || 0;
  const integrityScore = Number(supplier?.integrityScore) || 0;
  const availabilityScore = Number(supplier?.availabilityScore) || 0;
  const bivScore = Number(supplier?.bivScore) || 0; // Some systems expose calculated BIV separately
  const lastAssessmentDate = supplier?.lastAssessmentDate;
  console.log('supplier', supplier)
  // Fallback: calculate BIV if not provided (weighted average)
  const calculatedBIV =
    businessScore > 0 || integrityScore > 0 || availabilityScore > 0
      ? (businessScore * 0.4 + integrityScore * 0.3 + availabilityScore * 0.3)
      : 0;

  const displayBIVScore = bivScore > 0 ? bivScore : calculatedBIV;

  const getRiskBadgeVariant = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
      case "CRITICAL":
        return "destructive";
      case "MEDIUM":
        return "secondary"; // or "warning" if you have one
      case "LOW":
        return "success";
      default:
        return "outline";
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Shield className="w-6 h-6 text-primary" />
          Supplier Risk Assessment
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Overall Risk Summary */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Overall Risk Profile</h3>

              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-5xl font-bold text-foreground">
                    {overallScore}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
                </div>

                <div className="text-right">
                  <Badge
                    variant={getRiskBadgeVariant(riskLevel)}
                    className="text-sm px-3 py-1"
                  >
                    {riskLevel.toUpperCase()} RISK
                  </Badge>
                  {riskLevel === "HIGH" && (
                    <AlertTriangle className="w-8 h-8 text-red-500 mt-3 mx-auto" />
                  )}
                </div>
              </div>

              <Progress
                value={overallScore}
                className={`h-4 ${getProgressColor(overallScore)}`}

              />

              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0 - High Risk</span>
                <span>100 - Low Risk</span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Last Assessment</h4>
              <p className="text-sm text-muted-foreground">
                {lastAssessmentDate
                  ? new Date(lastAssessmentDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                  : "No assessment completed yet"}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Criticality</h4>
              <Badge variant={supplier?.criticality === "HIGH" ? "destructive" : "secondary"}>
                {supplier?.criticality || "Not Set"}
              </Badge>
            </div>
          </div>

          {/* Right: BIV Score Breakdown */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">BIV Score Breakdown</h3>
              <div className="text-right">
                <div className="text-3xl font-bold">{displayBIVScore.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Weighted BIV Score</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Business Impact */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    Business Impact
                  </span>
                  <span className={`font-bold text-lg ${getScoreColorClass(businessScore)}`}>
                    {businessScore}
                  </span>
                </div>
                <Progress value={businessScore} className="h-3" />
              </div>

              {/* Integrity */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    Integrity & Compliance
                  </span>
                  <span className={`font-bold text-lg ${getScoreColorClass(integrityScore)}`}>
                    {integrityScore}
                  </span>
                </div>
                <Progress value={integrityScore} className="h-3" />
              </div>

              {/* Availability */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    Availability & Resilience
                  </span>
                  <span className={`font-bold text-lg ${getScoreColorClass(availabilityScore)}`}>
                    {availabilityScore}
                  </span>
                </div>
                <Progress value={availabilityScore} className="h-3" />
              </div>
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">BIV Score Calculation:</p>
              <p className="text-xs">
                (Business × 40%) + (Integrity × 30%) + (Availability × 30%)
              </p>
              <p className="text-xs mt-2">
                Overall Score may include additional factors (e.g., response time, delivery, compliance rate).
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}