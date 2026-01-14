/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/pages/dashboard/admin/plans/plan.management.tsx
import { useState, useEffect } from "react";
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
  CreditCard,
  TrendingUp,
  Eye,
  X,
  PlusCircle,
  Save,
} from "lucide-react";
import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "@/redux/features/admin/admin.api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPlansQuery } from "@/redux/features/public/public.api";
import { ScrollArea } from "@/components/ui/scroll-area";
// Predefined features for selection
const ALL_FEATURES = [
  // Core Features
  { key: "dashboard", label: "Dashboard Access", type: "boolean" },
  { key: "reporting", label: "Advanced Reporting", type: "boolean" },
  { key: "apiAccess", label: "API Access", type: "boolean" },
  { key: "prioritySupport", label: "Priority Support", type: "boolean" },
  { key: "emailSupport", label: "Email Support", type: "boolean" },
  { key: "editSupplier", label: "Edit Supplier Data", type: "boolean" },
  { key: "fullAssessments", label: "Full Assessments", type: "boolean" },
  { key: "overallCompliance", label: "Overall Compliance", type: "boolean" },
  { key: "complianceDashboard", label: "Compliance Dashboard", type: "boolean" },
  { key: "standardAlertsAndReminders", label: "Alerts & Reminders", type: "boolean" },
  { key: "customWorkflows", label: "Custom Workflows", type: "boolean" },
  { key: "enterpriseSecurity", label: "Enterprise Security", type: "boolean" },
  { key: "dedicatedAccountManager", label: "Dedicated Account Manager", type: "boolean" },
  // Limit Features (numeric)
  { key: "supplierLimit", label: "Supplier Limit", type: "number" },
  { key: "assessmentLimit", label: "Assessment Limit", type: "number" },
  { key: "storageLimit", label: "Storage Limit (GB)", type: "number" },
  { key: "userLimit", label: "User Limit", type: "number" },
  { key: "messagesPerMonth", label: "Messages per Month", type: "number" },
  { key: "notificationsSend", label: "Notifications", type: "number" },
  { key: "documentReviewsPerMonth", label: "Document Reviews per Month", type: "number" },
  { key: "reportsGeneratedPerMonth", label: "Reports per Month", type: "number" },
  { key: "reportCreate", label: "Report Creation Limit", type: "number" },
  // Bundle Features
  { key: "everythingInFree", label: "Everything in Free", type: "boolean" },
  { key: "everythingInStarter", label: "Everything in Starter", type: "boolean" },
  { key: "everythingInProfessional", label: "Everything in Professional", type: "boolean" },
  { key: "everythingInBusiness", label: "Everything in Business", type: "boolean" },
];
export default function PlanManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "FREE",
    billingCycle: "MONTHLY",
    price: 0,
    currency: "EUR",
    supplierLimit: 5,
    assessmentLimit: 4,
    storageLimit: 2,
    userLimit: 1,
    trialDays: 14,
    isActive: true,
    isPopular: false,
    features: {} as Record<string, any>,
  });
  const { data: plansData, isLoading, refetch } = useGetPlansQuery();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();
  const plans = plansData?.data || [];
  // Initialize form with default features structure
  useEffect(() => {
    if (!editingPlan) {
      const defaultFeatures: Record<string, any> = {};
      ALL_FEATURES.forEach(feature => {
        if (feature.type === "boolean") {
          defaultFeatures[feature.key] = false;
        } else if (feature.type === "number") {
          defaultFeatures[feature.key] = null;
        }
      });
      setFormData(prev => ({
        ...prev,
        features: defaultFeatures
      }));
    }
  }, [editingPlan]);
  const handleCreatePlan = async () => {
    try {
      // Filter out null values from features
      const filteredFeatures = Object.fromEntries(
        Object.entries(formData.features).filter(([_, value]) => value !== null && value !== "")
      );

      const payload = {
        ...formData,
        price: parseFloat(formData.price.toString()),
        features: filteredFeatures
      };

      await createPlan(payload).unwrap();
      toast.success("Plan created successfully");
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create plan");
    }
  };
  const handleUpdatePlan = async () => {
    try {
      // Filter out null values from features
      const filteredFeatures = Object.fromEntries(
        Object.entries(formData.features).filter(([_, value]) => value !== null && value !== "")
      );

      const payload = {
        ...formData,
        price: parseFloat(formData.price.toString()),
        features: filteredFeatures
      };

      await updatePlan({ planId: editingPlan.id, data: payload }).unwrap();
      toast.success("Plan updated successfully");
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update plan");
    }
  };
  const handleDeletePlan = async (planId: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await deletePlan(planId).unwrap();
        toast.success("Plan deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete plan");
      }
    }
  };
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "FREE",
      billingCycle: "MONTHLY",
      price: 0,
      currency: "EUR",
      supplierLimit: 5,
      assessmentLimit: 4,
      storageLimit: 2,
      userLimit: 1,
      trialDays: 14,
      isActive: true,
      isPopular: false,
      features: {},
    });
    setEditingPlan(null);
  };
  const openEditDialog = (plan: any) => {
    setEditingPlan(plan);
    // Ensure all features are included in the form
    const allFeatures: Record<string, any> = {};
    ALL_FEATURES.forEach(feature => {
      allFeatures[feature.key] = plan.features?.[feature.key] ??
        (feature.type === "boolean" ? false : null);
    });

    setFormData({
      name: plan.name,
      description: plan.description,
      type: plan.type,
      billingCycle: plan.billingCycle,
      price: parseFloat(plan.price),
      currency: plan.currency,
      supplierLimit: plan.supplierLimit || 0,
      assessmentLimit: plan.assessmentLimit || 0,
      storageLimit: plan.storageLimit || 0,
      userLimit: plan.userLimit || 0,
      trialDays: plan.trialDays,
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      features: allFeatures,
    });
    setDialogOpen(true);
  };
  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };
  const openViewDialog = (plan: any) => {
    setSelectedPlan(plan);
    setViewDialogOpen(true);
  };
  const handleFeatureChange = (featureKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: value
      }
    }));
  };
  const addCustomFeature = () => {
    const customKey = `custom_${Date.now()}`;

    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [customKey]: true
      }
    }));
  };
  const removeFeature = (featureKey: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: undefined
      }
    }));
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
          <PlanFormDialog
            formData={formData}
            setFormData={setFormData}
            editingPlan={editingPlan}
            onFeatureChange={handleFeatureChange}
            onAddCustomFeature={addCustomFeature}
            onRemoveFeature={removeFeature}
            onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
            onClose={() => {
              setDialogOpen(false);
              resetForm();
            }}
          />
        </Dialog>
      </div>
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan: any) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onView={() => openViewDialog(plan)}
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
      {/* View Plan Details Dialog */}
      {selectedPlan && (
        <ViewPlanDialog
          plan={selectedPlan}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}
    </div>
  );
}
function PlanFormDialog({
  formData,
  setFormData,
  editingPlan,
  onFeatureChange,
  onAddCustomFeature,
  onRemoveFeature,
  onSubmit,
  onClose,
}: any) {
  const [activeTab, setActiveTab] = useState("basic");
  // Group features by type
  const booleanFeatures = ALL_FEATURES.filter(f => f.type === "boolean");
  const numberFeatures = ALL_FEATURES.filter(f => f.type === "number");
  // Get custom features (not in ALL_FEATURES)
  const customFeatures = Object.keys(formData.features || {})
    .filter(key => !ALL_FEATURES.some(f => f.key === key))
    .map(key => ({
      key,
      label: key.replace('custom_', 'Custom Feature '),
      type: "boolean" as const
    }));
  // Validation function
  const isFormValid = () => {
    return formData.name.trim() !== "" &&
      (formData.type === "FREE" || formData.price > 0);
  };
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="custom">Custom Features</TabsTrigger>
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
                required
              />
              {!formData.name.trim() && (
                <p className="text-red-500 text-sm">Plan name is required</p>
              )}
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
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="STARTER">Starter</SelectItem>
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
              <div className="flex items-center gap-2">
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currency: value })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              {formData.type !== "FREE" && formData.price <= 0 && (
                <p className="text-red-500 text-sm">Price must be greater than 0 for paid plans</p>
              )}
            </div>
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                value={formData.supplierLimit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supplierLimit: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Unlimited (leave empty)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessmentLimit">Assessment Limit</Label>
              <Input
                id="assessmentLimit"
                type="number"
                value={formData.assessmentLimit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assessmentLimit: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Unlimited (leave empty)"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storageLimit">Storage Limit (GB)</Label>
              <Input
                id="storageLimit"
                type="number"
                value={formData.storageLimit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storageLimit: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Unlimited (leave empty)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userLimit">User Limit</Label>
              <Input
                id="userLimit"
                type="number"
                value={formData.userLimit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    userLimit: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Unlimited (leave empty)"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messagesPerMonth">Messages per Month</Label>
              <Input
                id="messagesPerMonth"
                type="number"
                value={formData.features.messagesPerMonth || ""}
                onChange={(e) =>
                  onFeatureChange("messagesPerMonth", e.target.value ? parseInt(e.target.value) : null)
                }
                placeholder="Unlimited (leave empty)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notificationsSend">Notifications Limit</Label>
              <Input
                id="notificationsSend"
                type="number"
                value={formData.features.notificationsSend || ""}
                onChange={(e) =>
                  onFeatureChange("notificationsSend", e.target.value ? parseInt(e.target.value) : null)
                }
                placeholder="Unlimited (leave empty)"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="features" className="space-y-4">
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-4">
              {booleanFeatures.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <Label htmlFor={feature.key} className="font-medium">
                      {feature.label}
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {feature.key}
                    </p>
                  </div>
                  <Switch
                    id={feature.key}
                    checked={!!formData.features[feature.key]}
                    onCheckedChange={(checked) =>
                      onFeatureChange(feature.key, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-4 border-t">
            <div className="text-sm font-medium mb-2">Numeric Features</div>
            <div className="grid grid-cols-2 gap-4">
              {numberFeatures.map((feature) => (
                <div key={feature.key} className="space-y-2">
                  <Label htmlFor={`num-${feature.key}`}>{feature.label}</Label>
                  <Input
                    id={`num-${feature.key}`}
                    type="number"
                    value={formData.features[feature.key] || ""}
                    onChange={(e) =>
                      onFeatureChange(feature.key, e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="custom" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Custom Features</Label>
              <p className="text-sm text-gray-500">Add custom features specific to this plan</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onAddCustomFeature}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Custom Feature
            </Button>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-4">
              {customFeatures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No custom features added yet</p>
                  <p className="text-sm mt-1">Click "Add Custom Feature" to create one</p>
                </div>
              ) : (
                customFeatures.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <Input
                        value={feature.label}
                        onChange={(e) => {
                          // Update custom feature label
                          const newKey = `custom_${e.target.value.toLowerCase().replace(/\s+/g, '_')}`;
                          const newValue = formData.features[feature.key];
                          setFormData((prev: { features: any; }) => {
                            const newFeatures = { ...prev.features };
                            delete newFeatures[feature.key];
                            newFeatures[newKey] = newValue;
                            return { ...prev, features: newFeatures };
                          });
                        }}
                        className="mb-2"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!!formData.features[feature.key]}
                          onCheckedChange={(checked) =>
                            onFeatureChange(feature.key, checked)
                          }
                        />
                        <span className="text-sm">Enabled</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFeature(feature.key)}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!isFormValid()}>
          <Save className="h-4 w-4 mr-2" />
          {editingPlan ? "Update Plan" : "Create Plan"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
function PlanCard({ plan, onView, onEdit, onDelete }: any) {
  const formatPrice = (price: string) => {
    if (price === "0") return "Free";
    return `${plan.currency} ${parseFloat(price).toLocaleString()}`;
  };
  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case "FREE": return "bg-blue-100 text-blue-800";
      case "STARTER": return "bg-green-100 text-green-800";
      case "PROFESSIONAL": return "bg-purple-100 text-purple-800";
      case "ENTERPRISE": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <Card className={`relative hover:shadow-lg transition-shadow ${plan.isPopular ? "ring-2 ring-indigo-500" : ""}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-indigo-600 text-white shadow-lg">Most Popular</Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={getPlanTypeColor(plan.type)}>
                {plan.type}
              </Badge>
              {!plan.isActive && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  Inactive
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
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
        <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold">
            {formatPrice(plan.price)}
            <span className="text-lg text-gray-500">
              /{plan.billingCycle.toLowerCase()}
            </span>
          </div>
          {plan.originalPrice && (
            <div className="text-sm text-gray-500 line-through mt-1">
              {plan.currency} {plan.originalPrice}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Supplier Limit</span>
            <span className="font-medium">
              {plan.supplierLimit === null ? "Unlimited" : plan.supplierLimit}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Assessment Limit</span>
            <span className="font-medium">
              {plan.assessmentLimit === null ? "Unlimited" : plan.assessmentLimit}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Storage</span>
            <span className="font-medium">{plan.storageLimit} GB</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Users</span>
            <span className="font-medium">
              {plan.userLimit === null ? "Unlimited" : plan.userLimit}
            </span>
          </div>
        </div>
        <div className="pt-4">
          <div className="text-sm font-medium mb-2">Top Features</div>
          <div className="space-y-2">
            {plan.features?.prioritySupport && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Priority Support</span>
              </div>
            )}
            {plan.features?.apiAccess && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>API Access</span>
              </div>
            )}
            {plan.features?.fullAssessments && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Full Assessments</span>
              </div>
            )}
            {plan.features?.complianceDashboard && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Compliance Dashboard</span>
              </div>
            )}
            {plan.features?.editSupplier && (
              <div className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span>Edit Supplier Data</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={onView}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button className="flex-1" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
function ViewPlanDialog({ plan, open, onOpenChange }: any) {
  const formatPrice = (price: string) => {
    if (price === "0") return "Free";
    return `${plan.currency} ${parseFloat(price).toLocaleString()}`;
  };
  const getFeatureValue = (_key: string, value: any) => {
    if (value === null || value === undefined) return "Not included";
    if (typeof value === "boolean") return value ? "✓ Included" : "✗ Not included";
    if (typeof value === "number") return value === 0 ? "Unlimited" : value.toString();
    return value.toString();
  };
  // Group features
  const coreFeatures = Object.entries(plan.features || {})
    .filter(([, value]) => typeof value === "boolean")
    .sort(([a], [b]) => a.localeCompare(b));
  const limitFeatures = Object.entries(plan.features || {})
    .filter(([, value]) => typeof value === "number" || value === null)
    .sort(([a], [b]) => a.localeCompare(b));
  const customFeatures = Object.entries(plan.features || {})
    .filter(([key]) => key.startsWith("custom_"))
    .sort(([a], [b]) => a.localeCompare(b));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{plan.name}</DialogTitle>
              <DialogDescription className="text-base">
                {plan.description}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={plan.isActive ? "default" : "outline"}>
                {plan.isActive ? "Active" : "Inactive"}
              </Badge>
              {plan.isPopular && (
                <Badge className="bg-indigo-600">Popular</Badge>
              )}
            </div>
          </div>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Price</Label>
                    <div className="text-2xl font-bold mt-1">{formatPrice(plan.price)}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Billing Cycle</Label>
                    <div className="text-lg font-medium mt-1 capitalize">{plan.billingCycle.toLowerCase()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Currency</Label>
                    <div className="text-lg font-medium mt-1">{plan.currency}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Trial Days</Label>
                    <div className="text-lg font-medium mt-1">{plan.trialDays} days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Plan Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {plan.supplierLimit === null ? "∞" : plan.supplierLimit}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Suppliers</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {plan.assessmentLimit === null ? "∞" : plan.assessmentLimit}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Assessments</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{plan.storageLimit}</div>
                    <div className="text-sm text-gray-500 mt-1">Storage (GB)</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {plan.userLimit === null ? "∞" : plan.userLimit}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Plan Features</CardTitle>
                <CardDescription>All features included in this plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coreFeatures.map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 border rounded-lg ${value ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-center">
                          {value ? (
                            <Check className="h-5 w-5 text-green-600 mr-2" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mr-2" />
                          )}
                          <div>
                            <div className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                            <div className="text-sm text-gray-500">{key}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="limits">
            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
                <CardDescription>Monthly limits and quotas</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {limitFeatures.map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <div className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="text-sm text-gray-500">{key}</div>
                        </div>
                        <div className="text-lg font-bold">
                          {value == null ? "Unlimited" : value?.toString()}
                        </div>

                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Plan ID</Label>
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">{plan.id}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Plan Type</Label>
                    <div className="font-medium mt-1">{plan.type}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Stripe Product ID</Label>
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">{plan.stripeProductId || "N/A"}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Stripe Price ID</Label>
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">{plan.stripePriceId || "N/A"}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Created At</Label>
                    <div className="font-medium mt-1">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500">Updated At</Label>
                    <div className="font-medium mt-1">
                      {new Date(plan.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {customFeatures.length > 0 && (
                  <div>
                    <Label className="text-gray-500">Custom Features</Label>
                    <div className="mt-2 space-y-2">
                      {customFeatures.map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded">
                          <span className="font-medium">{key}</span>
                          <Badge variant="outline">
                            {getFeatureValue(key, value)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
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