// src/pages/vendor/tabs/PerformanceTab.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Props = {
  supplier: any;
  progress: any;
};

export default function PerformanceTab({ supplier, progress }: Props) {
  const stats = {
    totalAssessments: progress?.totalAssessments ?? supplier.statistics?.totalAssessments ?? 0,
    completedAssessments: progress?.completedAssessments ?? supplier.statistics?.approvedSubmissions ?? 0,
    pendingAssessments: supplier.statistics?.pendingSubmissions ?? 0,
    averageScore: progress?.averageScore ?? supplier.statistics?.averageScore ?? 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-sm text-muted-foreground">Total Assessments</CardTitle></CardHeader>
        <CardContent><p className="text-3xl font-bold">{stats.totalAssessments}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm text-muted-foreground">Completed</CardTitle></CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.completedAssessments}</p>
          <Progress value={stats.totalAssessments ? (stats.completedAssessments / stats.totalAssessments) * 100 : 0} className="mt-3" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm text-muted-foreground">Pending</CardTitle></CardHeader>
        <CardContent><p className="text-3xl font-bold text-orange-600">{stats.pendingAssessments}</p></CardContent>
      </Card>
    </div>
  );
}