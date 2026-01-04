/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/shared/ProblemsList.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { AlertCircle, MessageSquare, Plus, Filter, ChevronRight } from "lucide-react";
import { useGetProblemsQuery } from "@/redux/features/problem/problem.api";
import CreateProblemForm from "./CreateProblemForm";
import { useNavigate } from "react-router-dom";

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};
type Problem = {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  reportedBy: { email: string };
  supplier?: { name: string };
  _count: { messages: number };
  createdAt: string;
};

export default function ProblemsList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading } = useGetProblemsQuery(undefined);
  console.log("Problems data:", data);
  const problems = data?.data || [];
 // const meta = data?.data?.meta;

  const filteredProblems = problems.filter((p: any) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (priorityFilter !== "all" && p.priority !== priorityFilter) return false;
    return true;
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading problems...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Problems & Issues</h1>
          <p className="text-muted-foreground mt-1">
            Manage reported issues with suppliers
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Report New Problem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report a New Problem</DialogTitle>
            </DialogHeader>
            <CreateProblemForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <div className="space-y-4">
        {filteredProblems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No problems found</p>
            </CardContent>
          </Card>
        ) : (
          filteredProblems.map((problem: Problem) => (
            <Card
              key={problem.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/problems/${problem.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{problem.title}</h3>
                      <Badge className={priorityColors[problem.priority]}>
                        {problem.priority}
                      </Badge>
                      <Badge className={statusColors[problem.status]}>
                        {problem.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{problem.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>Reported by: {problem.reportedBy.email}</span>
                      <span>•</span>
                      <span>Supplier: {problem.supplier?.name || "N/A"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {problem._count.messages} messages
                      </span>
                      <span>•</span>
                      <span>{format(new Date(problem.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}