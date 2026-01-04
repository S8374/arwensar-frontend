import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  badge?: string;
}

export default function StatCard({ label, value, icon: Icon, color, bg, badge }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {badge && (
              <p >
                {badge}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}