// component/OverViewComponent/ComplianceGaugeCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  compliancePercentage: number;
  compliant: number;
  nonCompliant: number;
  total: number;
}

export default function ComplianceGaugeCard({ compliancePercentage, compliant, nonCompliant, total }: Props) {
  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (percentage >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGradientColor = (percentage: number) => {
    if (percentage >= 80) return "from-emerald-500 to-emerald-600";
    if (percentage >= 60) return "from-amber-500 to-amber-600";
    return "from-red-500 to-red-600";
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Overall Compliance
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current compliance status across all suppliers
        </p>
      </CardHeader>
      <CardContent>
        {/* Gauge Circle */}
        <div className="relative flex items-center justify-center my-8">
          <div className="relative">
            {/* Background circle */}
            <div className="w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {/* Progress ring */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${getGradientColor(compliancePercentage)} ${compliancePercentage * 3.6}deg, #e5e7eb 0deg)`
                }}
              />
              {/* Inner circle */}
              <div className="w-40 h-40 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getComplianceColor(compliancePercentage)}`}>
                    {compliancePercentage}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Compliance Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {compliant}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Compliant</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {nonCompliant}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Non-Compliant</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {total}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Compliance Progress</span>
            <span>{compliancePercentage}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getComplianceColor(compliancePercentage)}`}
              style={{ width: `${compliancePercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}