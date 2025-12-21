// components/notifications/NotificationsAlerts.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, FileText, Building2, Mail, Phone, Calendar, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useState } from "react";
import { format } from "date-fns";

interface SupplierProblem {
  id: string;
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  supplierId: string;
  supplier?: any; // we'll map it
}

export default function Alerts() {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Get problems + map the actual supplier data using supplierId
  const problems = (userData?.data?.vendor?.supplierProblems || []).map((problem: SupplierProblem) => {
    const supplier = userData?.data?.vendor?.suppliers?.find((s: any) => s.id === problem.supplierId);
    return { ...problem, supplier };
  });
console.log('problems',problems)
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case "MEDIUM":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-destructive text-destructive-foreground";
      case "MEDIUM": return "bg-orange-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) return <div className="py-8 text-center">Loading...</div>;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Notifications & Alerts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {problems.length} active supplier issue{problems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {problems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No issues reported from your suppliers.
            </CardContent>
          </Card>
        ) : (
          problems.map((problem: any) => (
            <Card key={problem.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-background border flex items-center justify-center">
                      {getPriorityIcon(problem.priority)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {problem.supplier?.name || "Unknown Supplier"}
                        </h3>
                        {problem.status === "OPEN" && (
                          <Badge variant="destructive" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="font-medium mt-1">{problem.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {problem.description}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                        <span className="capitalize">{problem.priority.toLowerCase()} priority</span>
                        <span>•</span>
                        <span>{format(new Date(problem.createdAt), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(problem.priority)}>
                      {problem.priority}
                    </Badge>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSupplier(problem.supplier)}
                        >
                          View Supplier
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl flex items-center gap-3">
                            <Building2 className="w-7 h-7" />
                            {selectedSupplier?.name || "Supplier Details"}
                          </DialogTitle>
                        </DialogHeader>

                        {selectedSupplier && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Contact Person</p>
                                  <p className="font-medium">{selectedSupplier.contactPerson}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p className="font-medium">{selectedSupplier.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Phone</p>
                                  <p className="font-medium">{selectedSupplier.phone}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Contract Period</p>
                                  <p className="font-medium">
                                    {format(new Date(selectedSupplier.contractStartDate), "MMM dd, yyyy")} →{" "}
                                    {format(new Date(selectedSupplier.contractEndDate), "MMM dd, yyyy")}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Category</p>
                                <Badge variant="secondary" className="mt-1">
                                  {selectedSupplier.category?.toUpperCase() || "N/A"}
                                </Badge>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">Criticality</p>
                                <Badge className={selectedSupplier.criticality === "HIGH" ? "bg-destructive" : "bg-orange-500"}>
                                  {selectedSupplier.criticality}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4 mt-4">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Related Issue:</p>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="font-medium">{problem.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{problem.description}</p>
                            <div className="flex gap-3 mt-3">
                              <Badge className={getPriorityColor(problem.priority)}>{problem.priority}</Badge>
                              <Badge variant="secondary">{problem.status}</Badge>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}