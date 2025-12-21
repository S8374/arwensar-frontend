import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  totalCompliant: number;
  compliant: number;
  pending: number;
  nonCompliant: number;
}

export default function ComplianceGaugeCard({ totalCompliant, compliant, pending, nonCompliant }: Props) {
  // Calculate percentages for the gauge
  const total = compliant + pending + nonCompliant;
  const compliantPercentage = total > 0 ? Math.round((compliant / total) * 100) : 0;
  const pendingPercentage = total > 0 ? Math.round((pending / total) * 100) : 0;
  const nonCompliantPercentage = total > 0 ? Math.round((nonCompliant / total) * 100) : 0;

  // Data for the semi-circle gauge
  const gaugeData = [
    { name: 'Compliant', value: compliantPercentage, color: '#10b981' },
    { name: 'Pending', value: pendingPercentage, color: '#f59e0b' },
    { name: 'Non-Compliant', value: nonCompliantPercentage, color: '#ef4444' },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-base sm:text-lg font-semibold">Compliance Gauge</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
        {/* Gauge Chart */}
        <div className="relative w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-[200px] sm:max-w-60 lg:max-w-[180px] h-[120px] sm:h-[140px] lg:h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="90%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  cornerRadius={5}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-x-0 top-16 md:top-20 lg:top-12 flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {totalCompliant}%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                Total
              </div>
            </div>
          </div>
        </div>

        {/* Stats Numbers */}
        <div className="w-full lg:w-1/2 shrink-0">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-2">
                {compliant}
              </div>
              <div className="text-xs text-muted-foreground">Compliant</div>
              <div className="text-xs font-medium text-chart-2">
                {compliantPercentage}%
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-4">
                {pending}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="text-xs font-medium text-chart-4">
                {pendingPercentage}%
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-1">
                {nonCompliant}
              </div>
              <div className="text-xs text-muted-foreground">Non-Compliant</div>
              <div className="text-xs font-medium text-chart-1">
                {nonCompliantPercentage}%
              </div>
            </div>
          </div>

          {/* Total Suppliers */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t text-center">
            <div className="text-sm text-muted-foreground">Total Suppliers</div>
            <div className="text-lg font-bold text-foreground">{total}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}