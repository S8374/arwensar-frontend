// src/components/pages/dashboard/admin/assessments/assessment.management.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart,
} from "lucide-react";
import {
  useGetAllAssessmentsQuery,
  useCreateAssessmentMutation,
  useUpdateAssessmentMutation,
  useDeleteAssessmentMutation,
} from "@/redux/features/admin/admin.api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssessmentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<any>(null);

  const { data: assessmentsData, isLoading, refetch } = useGetAllAssessmentsQuery();
  const [createAssessment] = useCreateAssessmentMutation();
  const [updateAssessment] = useUpdateAssessmentMutation();
  const [deleteAssessment] = useDeleteAssessmentMutation();

  const assessments = assessmentsData?.data || [];

  const filteredAssessments = assessments.filter((assessment: any) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.examId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.stage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      try {
        await deleteAssessment(assessmentId).unwrap();
        toast.success("Assessment deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete assessment");
      }
    }
  };

  const assessmentStats = {
    total: assessments.length,
    active: assessments.filter((a: any) => a.isActive).length,
    templates: assessments.filter((a: any) => a.isTemplate).length,
    inProgress: assessments.filter((a: any) => a.stage === "DRAFT").length,
  };

  if (isLoading) {
    return <AssessmentsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assessment Management</h1>
          <p className="text-gray-500">
            Create and manage risk assessment templates and exams
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAssessment ? "Edit Assessment" : "Create New Assessment"}
              </DialogTitle>
              <DialogDescription>
                {editingAssessment
                  ? "Update the assessment details"
                  : "Create a new risk assessment template"}
              </DialogDescription>
            </DialogHeader>
            {/* Assessment form would go here */}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button>
                {editingAssessment ? "Update Assessment" : "Create Assessment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Assessments"
          value={assessmentStats.total}
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Active Assessments"
          value={assessmentStats.active}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Templates"
          value={assessmentStats.templates}
          icon={Copy}
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={assessmentStats.inProgress}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assessments..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter Assessments</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2 space-y-2">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                        <TabsList className="grid grid-cols-3">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="DRAFT">Draft</TabsTrigger>
                          <TabsTrigger value="ACTIVE">Active</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assessments</CardTitle>
          <CardDescription>
            {filteredAssessments.length} assessment(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Time Limit</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment: any) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-mono text-sm">
                    {assessment.examId}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{assessment.title}</div>
                    <div className="text-sm text-gray-500">
                      {assessment.description?.substring(0, 50)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStageVariant(assessment.stage)}>
                      {assessment.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {assessment.totalPoints || 100}
                    </div>
                  </TableCell>
                  <TableCell>
                    {assessment.timeLimit
                      ? `${assessment.timeLimit} mins`
                      : "No limit"}
                  </TableCell>
                  <TableCell>
                    {assessment.categories?.length || 0} categories
                  </TableCell>
                  <TableCell>
                    {assessment.createdByUser?.email || "System"}
                  </TableCell>
                  <TableCell>
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingAssessment(assessment);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Import Assessment Template
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart className="h-4 w-4 mr-2" />
              Generate Assessment Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Copy className="h-4 w-4 mr-2" />
              Create Assessment Template
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessments.slice(0, 3).map((assessment: any) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium">{assessment.title}</div>
                      <div className="text-sm text-gray-500">
                        Created {new Date(assessment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{assessment.stage}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStageVariant(stage: string) {
  switch (stage) {
    case "ACTIVE":
      return "default";
    case "DRAFT":
      return "outline";
    case "ARCHIVED":
      return "secondary";
    default:
      return "outline";
  }
}

function AssessmentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-24" />
      <Skeleton className="h-[400px]" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48 md:col-span-2" />
      </div>
    </div>
  );
}