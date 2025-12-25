// src/pages/supplier-detail/components/RiskMetrics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown,
  Activity,
  BarChart3
} from "lucide-react";

interface RiskMetricsProps {
  supplier: any;
  progress: any;
}

export default function RiskMetrics({ supplier, progress }: RiskMetricsProps) {
  const riskData = {
    riskLevel: progress?.riskLevel || "Not Assessed",
    bivScore: progress?.overallBIVScore || 0,
    businessScore: progress?.businessScore || 0,
    integrityScore: progress?.integrityScore || 0,
    availabilityScore: progress?.availabilityScore || 0,
    lastUpdated: supplier.lastAssessmentDate
  };

  const getRiskVariant = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high":
      case "critical":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Risk */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Overall Risk Profile</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-bold">
                    {riskData.bivScore.toFixed(1)}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">BIV Score</div>
                    <Badge variant={getRiskVariant(riskData.riskLevel)}>
                      {riskData.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>
              <Progress 
                value={riskData.bivScore} 
                className="h-3"
                indicatorClassName={`${getScoreColor(riskData.bivScore).replace('text-', 'bg-')}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>High Risk</span>
                <span>Low Risk</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-4">Last Assessment</h3>
              <div className="text-sm text-muted-foreground">
                {riskData.lastUpdated 
                  ? new Date(riskData.lastUpdated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                  : "No assessment completed"
                }
              </div>
            </div>
          </div>

          {/* BIV Breakdown */}
          <div className="space-y-6">
            <h3 className="font-medium">BIV Score Breakdown</h3>
            
            <div className="space-y-4">
              {/* Business Impact */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Business Impact</span>
                  <span className={`font-bold ${getScoreColor(riskData.businessScore)}`}>
                    {riskData.businessScore.toFixed(1)}
                  </span>
                </div>
                <Progress 
                  value={riskData.businessScore} 
                  className="h-2"
                  indicatorClassName="bg-blue-500"
                />
              </div>

              {/* Integrity */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Integrity</span>
                  <span className={`font-bold ${getScoreColor(riskData.integrityScore)}`}>
                    {riskData.integrityScore.toFixed(1)}
                  </span>
                </div>
                <Progress 
                  value={riskData.integrityScore} 
                  className="h-2"
                  indicatorClassName="bg-green-500"
                />
              </div>

              {/* Availability */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Availability</span>
                  <span className={`font-bold ${getScoreColor(riskData.availabilityScore)}`}>
                    {riskData.availabilityScore.toFixed(1)}
                  </span>
                </div>
                <Progress 
                  value={riskData.availabilityScore} 
                  className="h-2"
                  indicatorClassName="bg-purple-500"
                />
              </div>
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p className="mb-1">
                <span className="font-medium">BIV Score Formula:</span>
              </p>
              <p className="text-xs">
                (Business × 40%) + (Integrity × 30%) + (Availability × 30%)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}