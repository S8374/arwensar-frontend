/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  FileText,
  CheckCircle,
  Clock,
  Save,
  PlusCircle,
  FileQuestion,
  Layers,
  RefreshCw,
} from "lucide-react";
import {
  useGetAllAssessmentsQuery,
  useCreateAssessmentMutation,
  useUpdateAssessmentMutation,
  useDeleteAssessmentMutation,
} from "@/redux/features/admin/admin.api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useGetAssessmentByIdQuery } from "@/redux/features/assainment/assainment.api";

export default function AssessmentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [editingAssessment, setEditingAssessment] = useState<any>(null);

  const [formData, setFormData] = useState({
    examId: "",
    title: "",
    description: "",
      vendorId: "VENDOR_ID_HERE", 

    isActive: true,
    isTemplate: false,
    stage: "INITIAL",           // Fixed: must be INITIAL | FULL | COMPLETE
    totalPoints: 100,
    passingScore: 70,
    timeLimit: 60,
    categories: [] as any[],
  });

  const { data: assessmentsData, isLoading, refetch } = useGetAllAssessmentsQuery();
  const [createAssessment] = useCreateAssessmentMutation();
  const [updateAssessment] = useUpdateAssessmentMutation();
  const [deleteAssessment] = useDeleteAssessmentMutation();

  const { data: assessmentDetails } = useGetAssessmentByIdQuery(
    selectedAssessment?.id,
    { skip: !selectedAssessment?.id }
  );

  const assessments = assessmentsData?.data || [];
  const filteredAssessments = assessments.filter((assessment: any) => {
    const matchesSearch =
      assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.examId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.stage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const assessmentStats = {
    total: assessments.length,
    active: assessments.filter((a: any) => a.isActive).length,
    templates: assessments.filter((a: any) => a.isTemplate).length,
    inProgress: assessments.filter((a: any) => a.stage === "INITIAL").length,
  };

  // Load data when editing
  useEffect(() => {
    if (editingAssessment) {
      setFormData({
        examId: editingAssessment.examId || "",
        title: editingAssessment.title || "",
        description: editingAssessment.description || "",
        vendorId: editingAssessment.vendorId || "",
        isActive: editingAssessment.isActive ?? true,
        isTemplate: editingAssessment.isTemplate ?? false,
        stage: editingAssessment.stage || "INITIAL",
        totalPoints: editingAssessment.totalPoints || 100,
        passingScore: editingAssessment.passingScore || 70,
        timeLimit: editingAssessment.timeLimit || 60,
        categories: editingAssessment.categories || [],
      });
    }
  }, [editingAssessment]);

  const preparePayload = () => {
    return {
      ...formData,
      totalPoints: Number(formData.totalPoints),
      passingScore: formData.passingScore ? Number(formData.passingScore) : undefined,
      timeLimit: formData.timeLimit ? Number(formData.timeLimit) : undefined,
      categories: formData.categories.map((cat, catIdx) => ({
        ...cat,
        order: catIdx + 1,
        questions: (cat.questions || []).map((q: any, qIdx: number) => ({
          ...q,
          questionId: Number(q.questionId), // Ensure number
          order: qIdx + 1,
          weight: q.weight ? Number(q.weight) : undefined,
          maxScore: Number(q.maxScore || 10),
        })),
      })),
    };
  };

  const handleCreateAssessment = async () => {
    try {
      const payload = {
        ...preparePayload(),
        createdBy: "admin", // ← replace with real auth user id
        // vendorId should already be in formData
      };

      if (!payload.vendorId) {
        toast.error("Vendor ID is required");
        return;
      }

      await createAssessment(payload).unwrap();
      toast.success("Assessment created successfully");
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create assessment");
    }
  };

  const handleUpdateAssessment = async () => {
    try {
      const payload = preparePayload();

      await updateAssessment({
        assessmentId: editingAssessment.id,
        data: payload,
      }).unwrap();

      toast.success("Assessment updated successfully");
      setDialogOpen(false);
      resetForm();
      setEditingAssessment(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update assessment");
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await deleteAssessment(assessmentId).unwrap();
      toast.success("Assessment deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete assessment");
    }
  };



  const resetForm = () => {
    setFormData({
      examId: "",
      title: "",
      description: "",
      vendorId: "",
      isActive: true,
      isTemplate: false,
      stage: "INITIAL",
      totalPoints: 100,
      passingScore: 70,
      timeLimit: 60,
      categories: [],
    });
    setEditingAssessment(null);
  };

  const openEditDialog = (assessment: any) => {
    setEditingAssessment(assessment);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openViewDialog = (assessment: any) => {
    setSelectedAssessment(assessment);
    setViewDialogOpen(true);
  };

  // ────────────────────────────────────────────────
  // Category & Question CRUD
  // ────────────────────────────────────────────────

  const addCategory = () => {
    const newCategory = {
      categoryId: `C${formData.categories.length + 1}`,
      title: "",
      description: "",
      order: formData.categories.length + 1,
      weight: 100,
      maxScore: 100,
      questions: [],
    };
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const updateCategory = (index: number, field: string, value: any) => {
    const updated = [...formData.categories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, categories: updated }));
  };

  const deleteCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }));
  };

  const addQuestion = (categoryIndex: number) => {
    const category = formData.categories[categoryIndex];
    const nextQuestionId = (category.questions?.length || 0) + 1;

    const newQuestion = {
      questionId: nextQuestionId,          // ← numeric ID
      question: "",
      description: "",
      order: nextQuestionId,
      isDocument: false,
      isInputField: false,
      answerType: "YES",
      weight: 10,
      maxScore: 10,
      helpText: "",
      bivCategory: "",
      evidenceRequired: false,
    };

    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      questions: [...(updatedCategories[categoryIndex].questions || []), newQuestion],
    };

    setFormData((prev) => ({ ...prev, categories: updatedCategories }));
  };

  const updateQuestion = (
    categoryIndex: number,
    questionIndex: number,
    field: string,
    value: any
  ) => {
    const updatedCategories = [...formData.categories];
    const cat = updatedCategories[categoryIndex];
    const questions = [...(cat.questions || [])];
    questions[questionIndex] = { ...questions[questionIndex], [field]: value };
    updatedCategories[categoryIndex] = { ...cat, questions };
    setFormData((prev) => ({ ...prev, categories: updatedCategories }));
  };

  const deleteQuestion = (categoryIndex: number, questionIndex: number) => {
    const updatedCategories = [...formData.categories];
    const cat = updatedCategories[categoryIndex];
    const questions = (cat.questions || []).filter((_: any, i: number) => i !== questionIndex);
    updatedCategories[categoryIndex] = { ...cat, questions };
    setFormData((prev) => ({ ...prev, categories: updatedCategories }));
  };

  if (isLoading) return <AssessmentsSkeleton />;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assessment Management</h1>
          <p className="text-muted-foreground">
            Create, edit and manage risk assessments and templates
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New Assessment
              </Button>
            </DialogTrigger>

            <AssessmentFormDialog
              formData={formData}
              setFormData={setFormData}
              editing={!!editingAssessment}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onAddQuestion={addQuestion}
              onUpdateQuestion={updateQuestion}
              onDeleteQuestion={deleteQuestion}
              onSubmit={editingAssessment ? handleUpdateAssessment : handleCreateAssessment}
              onClose={() => {
                setDialogOpen(false);
                resetForm();
              }}
            />
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={assessmentStats.total} icon={FileText} color="indigo" />
        <StatCard title="Active" value={assessmentStats.active} icon={CheckCircle} color="green" />
        <StatCard title="Templates" value={assessmentStats.templates} icon={Copy} color="blue" />
        <StatCard title="Initial" value={assessmentStats.inProgress} icon={Clock} color="amber" />
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or exam ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="INITIAL">Initial</SelectItem>
                <SelectItem value="FULL">Full</SelectItem>
                <SelectItem value="COMPLETE">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assessments</CardTitle>
          <CardDescription>{filteredAssessments.length} items found</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((a: any) => (
                <TableRow key={a.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono">{a.examId}</TableCell>
                  <TableCell>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{a.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={a.stage === "INITIAL" ? "default" : "secondary"}>
                      {a.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{a.totalPoints || 100}</div>
                    {a.passingScore && (
                      <div className="text-xs text-muted-foreground">Pass: {a.passingScore}</div>
                    )}
                  </TableCell>
                  <TableCell>{a.categories?.length || 0}</TableCell>
                  <TableCell>
                    {a.categories?.reduce((sum: number, c: any) => sum + (c.questions?.length || 0), 0) || 0}
                  </TableCell>
                  <TableCell>{a.createdByUser?.email || "—"}</TableCell>
                  <TableCell>{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewDialog(a)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(a)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                    
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAssessment(a.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAssessments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No assessments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedAssessment && (
        <ViewAssessmentDialog
          assessment={assessmentDetails?.data || selectedAssessment}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────
// Form Dialog Component
// ────────────────────────────────────────────────

function AssessmentFormDialog({
  formData,
  setFormData,
  editing,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onSubmit,
  onClose,
}: any) {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editing ? "Edit Assessment" : "Create Assessment"}</DialogTitle>
        <DialogDescription>
          {editing ? "Update assessment details" : "Define a new risk assessment"}
        </DialogDescription>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="categories">Categories & Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-5 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exam ID *</Label>
              <Input
                value={formData.examId}
                onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                placeholder="e.g. INITIAL-SCAN-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Assessment name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Purpose and scope of this assessment..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total Points</Label>
              <Input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Passing Score</Label>
              <Input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Time Limit (min)</Label>
              <Input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                placeholder="0 = unlimited"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Categories & Questions</h3>
              <p className="text-sm text-muted-foreground">Organize questions into logical groups</p>
            </div>
            <Button variant="outline" onClick={onAddCategory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          <ScrollArea className="h-[480px] pr-4">
            <div className="space-y-6">
              {formData.categories.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No categories yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Start by adding a category to organize your questions
                  </p>
                  <Button variant="outline" className="mt-6" onClick={onAddCategory}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Category
                  </Button>
                </div>
              ) : (
                formData.categories.map((category: any, catIdx: number) => (
                  <Card key={catIdx} className="overflow-hidden">
                    <CardHeader className="bg-muted/40 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Layers className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-base">Category {catIdx + 1}</CardTitle>
                            <CardDescription className="text-xs">
                              {category.questions?.length || 0} questions
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => onDeleteCategory(catIdx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Input
                            value={category.title}
                            onChange={(e) => onUpdateCategory(catIdx, "title", e.target.value)}
                            placeholder="e.g. Access Control"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Weight (%)</Label>
                          <Input
                            type="number"
                            value={category.weight}
                            onChange={(e) => onUpdateCategory(catIdx, "weight", Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description (optional)</Label>
                        <Textarea
                          value={category.description || ""}
                          onChange={(e) => onUpdateCategory(catIdx, "description", e.target.value)}
                          rows={2}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileQuestion className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Questions</span>
                            <Badge variant="outline">{category.questions?.length || 0}</Badge>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => onAddQuestion(catIdx)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Question
                          </Button>
                        </div>

                        {category.questions?.map((q: any, qIdx: number) => (
                          <div key={q.questionId} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium">Question {qIdx + 1}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  ID: {q.questionId} • Order: {q.order}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => onDeleteQuestion(catIdx, qIdx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Question Text *</Label>
                                <Input
                                  value={q.question}
                                  onChange={(e) => onUpdateQuestion(catIdx, qIdx, "question", e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Answer Type</Label>
                                <Select
                                  value={q.answerType}
                                  onValueChange={(val) => onUpdateQuestion(catIdx, qIdx, "answerType", val)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="YES">Yes/No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Description / Instructions (optional)</Label>
                              <Textarea
                                value={q.description || ""}
                                onChange={(e) => onUpdateQuestion(catIdx, qIdx, "description", e.target.value)}
                                rows={2}
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Weight</Label>
                                <Input
                                  type="number"
                                  value={q.weight}
                                  onChange={(e) => onUpdateQuestion(catIdx, qIdx, "weight", Number(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Max Score</Label>
                                <Input
                                  type="number"
                                  value={q.maxScore}
                                  onChange={(e) => onUpdateQuestion(catIdx, qIdx, "maxScore", Number(e.target.value))}
                                />
                              </div>
                             <div className="space-y-2">
  <Label>BIV Category</Label>
  <Select
    value={q.bivCategory || ""}
    onValueChange={(value) => onUpdateQuestion(catIdx, qIdx, "bivCategory", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select BIV category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="BUSINESS">BUSINESS</SelectItem>
      <SelectItem value="INTEGRITY">INTEGRITY</SelectItem>
      <SelectItem value="AVAILABILITY">AVAILABILITY</SelectItem>
    </SelectContent>
  </Select>
</div>
                            </div>

                            <div className="flex flex-wrap gap-6 pt-2">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={q.isDocument}
                                  onCheckedChange={(checked) => onUpdateQuestion(catIdx, qIdx, "isDocument", checked)}
                                />
                                <Label>Requires Document Upload</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={q.evidenceRequired}
                                  onCheckedChange={(checked) => onUpdateQuestion(catIdx, qIdx, "evidenceRequired", checked)}
                                />
                                <Label>Evidence Required</Label>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Help Text (optional)</Label>
                              <Textarea
                                value={q.helpText || ""}
                                onChange={(e) => onUpdateQuestion(catIdx, qIdx, "helpText", e.target.value)}
                                placeholder="Additional guidance for the vendor..."
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings" className="pt-4 space-y-6">
          <div className="space-y-2">
            <Label>Assessment Stage *</Label>
            <Select
              value={formData.stage}
              onValueChange={(val) => setFormData({ ...formData, stage: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INITIAL">Initial / Quick Scan</SelectItem>
                <SelectItem value="FULL">Full Assessment</SelectItem>
                <SelectItem value="COMPLETE">Complete / Final</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Stage cannot be "DRAFT" when creating — starts as "INITIAL"
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isTemplate}
                onCheckedChange={(checked) => setFormData({ ...formData, isTemplate: checked })}
              />
              <Label>Is Template</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vendor ID * (Currently Optional)</Label>
            <Input
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              placeholder="VENDOR-123 or Its optional"
            />
            <p className="text-xs text-muted-foreground">
              Required when creating a new assessment
            </p>
          </div>

          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categories:</span>
                <span>{formData.categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Questions:</span>
                <span>
                  {formData.categories.reduce((sum: number, c: any) => sum + (c.questions?.length || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Points:</span>
                <span>{formData.totalPoints}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {editing ? "Save Changes" : "Create Assessment"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// View Dialog remains mostly unchanged — can be kept as is or slimmed down if desired

function ViewAssessmentDialog({ assessment, open, onOpenChange }: any) {
  if (!assessment) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{assessment.title}</DialogTitle>
          <DialogDescription>{assessment.description || "No description"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Exam ID</div>
              <div className="font-mono font-medium">{assessment.examId}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Stage</div>
              <Badge variant="outline">{assessment.stage}</Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Points</div>
              <div className="text-lg font-bold">{assessment.totalPoints || 100}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Passing Score</div>
              <div className="text-lg font-bold">{assessment.passingScore || "—"}</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Category Summary</h4>
            <div className="space-y-3">
              {assessment.categories?.map((cat: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-muted/40 rounded">
                  <div>
                    <div className="font-medium">{cat.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {cat.questions?.length || 0} questions • Weight: {cat.weight || 0}%
                    </div>
                  </div>
                  <Badge variant="outline">{cat.maxScore || 100} pts</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            Created {new Date(assessment.createdAt).toLocaleDateString()} •{" "}
            {assessment.createdByUser?.email || "System"}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ title, value, icon: Icon }: any) {

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentsSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-20 rounded-lg" />
      <Skeleton className="h-[500px] rounded-lg" />
    </div>
  );
}