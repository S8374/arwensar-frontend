// component/OverViewComponent/ComplianceDonutChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

interface Props {
  data: Array<{ name: string; value: number; color: string }>;
}

export default function ComplianceDonutChart({ data }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <Card className="h-full flex flex-col border-0 shadow-xl bg-linear-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 shrink-0">
        <div className="space-y-1">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Compliance Overview
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Risk distribution across all suppliers
          </p>
        </div>
        <Popover>
          {/* <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <CalendarIcon className="w-3 h-3 mr-2" />
              {date ? format(date, "MMM dd, yyyy") : "Select date"}
              <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger> */}
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="pt-2 flex-1 flex flex-col">
        {/* Chart Container */}
        <div className="flex-1 min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="75%"
                paddingAngle={3}
                cornerRadius={8}
                dataKey="value"
                strokeWidth={2}
                stroke="transparent"
              >
                {data.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                className="text-2xl sm:text-3xl md:text-4xl font-bold fill-gray-900 dark:fill-white"
              >
                {total}%
              </text>
              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                className="text-xs sm:text-sm fill-gray-600 dark:fill-gray-400"
              >
                Total Compliance
              </text>
              <Tooltip
                formatter={(v: number) => [`${v}%`, 'Percentage']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-6 sm:mt-8 space-y-3 shrink-0">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.value}%
                </span>
                <div
                  className="w-12 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}