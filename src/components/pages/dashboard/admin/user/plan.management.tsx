// src/components/pages/dashboard/admin/plans/plan.management.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  CreditCard,
  Users,
  FileText,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "@/redux/features/admin/admin.api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPlansQuery } from "@/redux/features/public/public.api";

export default function PlanManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "BASIC",
    billingCycle: "MONTHLY",
    price: 0,
    currency: "EUR",
    supplierLimit: 10,
    assessmentLimit: 5,
    storageLimit: 5,
    userLimit: 1,
    trialDays: 14,
    isActive: true,
    isPopular: false,
    features: {
      dashboard: true,
      reporting: false,
      apiAccess: false,
      prioritySupport: false,
    },
  });

  const { data: plansData, isLoading, refetch } = useGetPlansQuery();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const plans = plansData?.data || [];

  const handleCreatePlan = async () => {
    try {
      await createPlan(formData).unwrap();
      toast.success("Plan created successfully");
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to create plan");
    }
  };

  const handleUpdatePlan = async () => {
    try {
      await updatePlan({ planId: editingPlan.id, ...formData }).unwrap();
      toast.success("Plan updated successfully");
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to update plan");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await deletePlan(planId).unwrap();
        toast.success("Plan deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete plan");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "BASIC",
      billingCycle: "MONTHLY",
      price: 0,
      currency: "EUR",
      supplierLimit: 10,
      assessmentLimit: 5,
      storageLimit: 5,
      userLimit: 1,
      trialDays: 14,
      isActive: true,
      isPopular: false,
      features: {
        dashboard: true,
        reporting: false,
        apiAccess: false,
        prioritySupport: false,
      },
    });
    setEditingPlan(null);
  };

  const openEditDialog = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      type: plan.type,
      billingCycle: plan.billingCycle,
      price: plan.price,
      currency: plan.currency,
      supplierLimit: plan.supplierLimit,
      assessmentLimit: plan.assessmentLimit,
      storageLimit: plan.storageLimit,
      userLimit: plan.userLimit,
      trialDays: plan.trialDays,
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      features: plan.features,
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (isLoading) {
    return <PlansSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plan Management</h1>
          <p className="text-gray-500">
            Create and manage subscription plans for vendors
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Edit Plan" : "Create New Plan"}
              </DialogTitle>
              <DialogDescription>
                {editingPlan
                  ? "Update the plan details below"
                  : "Fill in the details to create a new subscription plan"}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="limits">Limits</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Professional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Plan Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">Basic</SelectItem>
                        <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the plan features..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, currency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingCycle">Billing Cycle</Label>
                    <Select
                      value={formData.billingCycle}
                      onValueChange={(value) =>
                        setFormData({ ...formData, billingCycle: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="DAILY">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trialDays">Trial Days</Label>
                    <Input
                      id="trialDays"
                      type="number"
                      value={formData.trialDays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trialDays: parseInt(e.target.value),
                        })
                      }
                      placeholder="14"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPopular"
                      checked={formData.isPopular}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPopular: checked })
                      }
                    />
                    <Label htmlFor="isPopular">Popular</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="limits" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierLimit">Supplier Limit</Label>
                    <Input
                      id="supplierLimit"
                      type="number"
                      value={formData.supplierLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supplierLimit: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessmentLimit">Assessment Limit</Label>
                    <Input
                      id="assessmentLimit"
                      type="number"
                      value={formData.assessmentLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assessmentLimit: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storageLimit">Storage Limit (GB)</Label>
                    <Input
                      id="storageLimit"
                      type="number"
                      value={formData.storageLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          storageLimit: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userLimit">User Limit</Label>
                    <Input
                      id="userLimit"
                      type="number"
                      value={formData.userLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          userLimit: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dashboard"
                      checked={formData.features.dashboard}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          features: { ...formData.features, dashboard: checked },
                        })
                      }
                    />
                    <Label htmlFor="dashboard">Advanced Dashboard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reporting"
                      checked={formData.features.reporting}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          features: { ...formData.features, reporting: checked },
                        })
                      }
                    />
                    <Label htmlFor="reporting">Advanced Reporting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="apiAccess"
                      checked={formData.features.apiAccess}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          features: { ...formData.features, apiAccess: checked },
                        })
                      }
                    />
                    <Label htmlFor="apiAccess">API Access</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="prioritySupport"
                      checked={formData.features.prioritySupport}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          features: {
                            ...formData.features,
                            prioritySupport: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="prioritySupport">Priority Support</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}
              >
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan: any) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={() => openEditDialog(plan)}
            onDelete={() => handleDeletePlan(plan.id)}
          />
        ))}
      </div>

      {/* Plan Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Plans</p>
                <h3 className="text-2xl font-bold mt-2">{plans.length}</h3>
              </div>
              <div className="p-3 rounded-full bg-indigo-50">
                <CreditCard className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Plans</p>
                <h3 className="text-2xl font-bold mt-2">
                  {plans.filter((p: any) => p.isActive).length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Popular Plans</p>
                <h3 className="text-2xl font-bold mt-2">
                  {plans.filter((p: any) => p.isPopular).length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-amber-50">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PlanCard({ plan, onEdit, onDelete }: any) {
  return (
    <Card className={`relative ${plan.isPopular ? "ring-2 ring-indigo-500" : ""}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-indigo-600 text-white">Most Popular</Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold">
            {plan.currency} {plan.price}
            <span className="text-lg text-gray-500">
              /{plan.billingCycle.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Supplier Limit</span>
            <span className="font-medium">{plan.supplierLimit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Assessment Limit</span>
            <span className="font-medium">{plan.assessmentLimit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Storage</span>
            <span className="font-medium">{plan.storageLimit} GB</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Users</span>
            <span className="font-medium">{plan.userLimit}</span>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-sm font-medium mb-2">Features</div>
          <div className="space-y-2">
            {plan.features?.dashboard && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Dashboard</span>
              </div>
            )}
            {plan.features?.reporting && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Reporting</span>
              </div>
            )}
            {plan.features?.apiAccess && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>API Access</span>
              </div>
            )}
            {plan.features?.prioritySupport && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Priority Support</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="flex items-center justify-between w-full text-sm">
          <span className="text-gray-600">Status</span>
          <Badge variant={plan.isActive ? "default" : "outline"}>
            {plan.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex items-center justify-between w-full text-sm">
          <span className="text-gray-600">Type</span>
          <Badge variant="secondary">{plan.type}</Badge>
        </div>
        <Button className="w-full mt-4">
          <CreditCard className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

function PlansSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px]" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}