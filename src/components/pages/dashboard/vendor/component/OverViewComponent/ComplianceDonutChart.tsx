import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { useState } from "react";

interface Props {
  data: Array<{ name: string; value: number; color: string }>;
}

export default function ComplianceDonutChart({ data }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 shrink-0">
        <CardTitle className="text-base sm:text-lg font-semibold">Compliance Overview</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {date ? format(date, "MMM dd") : "Select date"}
              <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="pt-4 flex-1 flex flex-col">
        {/* Chart Container - Responsive height */}
        <div className="flex-1 min-h-[200px] sm:min-h-[250px] md:min-h-[280px] lg:min-h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={2}
                cornerRadius={6}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <text 
                x="50%" 
                y="48%" 
                textAnchor="middle" 
                className="text-xl sm:text-xl md:text-4xl font-bold fill-foreground"
              >
                {total}%
              </text>
              <text 
                x="50%" 
                y="58%" 
                textAnchor="middle" 
                className="text-[12px] fill-muted-foreground"
              >
                Total Compliance
              </text>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend - Responsive spacing */}
        <div className="mt-4 sm:mt-6 space-y-2 shrink-0">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">{item.name}</span>
              </div>
              <span className="font-medium shrink-0 ml-2">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}