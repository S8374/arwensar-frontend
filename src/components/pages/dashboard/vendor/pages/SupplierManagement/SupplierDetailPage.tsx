/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/vendor/SupplierDetailPage.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Briefcase, Phone, Mail, AlertCircle, Shield, User,
  CheckCircle2, Clock,
  Edit2
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useGetSupplierByIdQuery,
  useLazyGetSingelSupplyerProgressQuery,
} from "@/redux/features/vendor/vendor.api";

import SendAlertModal from "./model/SendAlertModal";
import SupplierOverviewTab from "./component/tabs/SupplierOverview";
import ComplianceTab from "./component/tabs/Compliance";
import PerformanceTab from "./component/tabs/Performance";
import DocumentsTab from "./component/tabs/DocumentsTab";
import CreateNotificationDialog from "../Alerts/CreateNotificationDialog";
import EditSupplierModal from "./model/EditSupplierModal";



const getCriticalityVariant = (criticality: string | null) => {
  switch (criticality?.toUpperCase()) {
    case "CRITICAL":
    case "HIGH": return "destructive";
    case "MEDIUM": return "warning";
    case "LOW": return "success";
    default: return "default";
  }
};

const getRiskLevelVariant = (risk: string | null) => {
  switch (risk?.toUpperCase()) {
    case "HIGH": return "destructive";
    case "MEDIUM": return "outline";
    case "LOW": return "default";
    default: return "default";
  }
};



const calculateContractStatus = (endDate: string | null) => {
  if (!endDate) return { status: "No End Date", variant: "default" as const, days: null };
  const end = new Date(endDate);
  const today = new Date();
  const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) return { status: "Expired", variant: "destructive" as const, days: Math.abs(daysRemaining) };
  if (daysRemaining <= 30) return { status: "Expiring Soon", variant: "outline" as const, days: daysRemaining };
  return { status: "Active", variant: "outline" as const, days: daysRemaining };
};

const getNis2Status = (supplier: any) => {
  const totalAssessments = supplier.statistics?.totalAssessments ?? 0;
  const submittedAssessments = supplier.statistics?.totalSubmissions ?? 0;
  console.log(".......", totalAssessments, submittedAssessments)
  // If total assessments equals submitted assessments → Compliant
  if (totalAssessments === submittedAssessments) {
    return { label: "Non-Compliant", variant: "outline" as const, icon: CheckCircle2 };
  }

  // Otherwise → Non-Compliant
  return { label: "Compliant", variant: "destructive" as const, icon: Clock };
};
export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  // const [isContractOpen, setIsContractOpen] = useState(false);
  const {
    data: supplierResponse,
    isLoading: loadingSupplier,
    error: supplierError
  } = useGetSupplierByIdQuery(id!, { skip: !id });

  const [getProgress, { data: progressData, isLoading: loadingProgress }] = useLazyGetSingelSupplyerProgressQuery();

  const supplier = supplierResponse?.data;
  const progress = progressData?.data;

  useEffect(() => {
    if (id) getProgress(id);
  }, [id, getProgress]);

  if (loadingSupplier || loadingProgress) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-8 w-32 mb-2" /><Skeleton className="h-4 w-24" /></CardContent></Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (supplierError || !supplier) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-12 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-destructive mb-2">Supplier Not Found</h2>
            <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nis2 = getNis2Status(supplier);
  console.log("Supplier single getNis2Status", nis2);

  const contract = calculateContractStatus(supplier.contractEndDate);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Briefcase className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold">{supplier.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Badge variant={getCriticalityVariant(supplier.criticality)}>
                    {supplier.criticality || "N/A"} Criticality
                  </Badge>
                  <Badge variant={supplier.isActive ? "success" : "secondary"}>
                    {supplier.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{supplier.category}</Badge>
                  <Badge variant={getRiskLevelVariant(supplier.riskLevel)}>
                    Risk: {supplier.riskLevel || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2"><User className="w-4 h-4" />{supplier.contactPerson}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><a href={`mailto:${supplier.email}`} className="text-primary hover:underline">{supplier.email}</a></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{supplier.phone || "N/A"}</div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Shield className="w-6 h-6" />
              <span className="font-medium">NIS2 Compliance:</span>
              <Badge variant={nis2.variant} className="text-base px-3 py-1 flex items-center gap-2">
                <nis2.icon className="w-4 h-4" />
                {nis2.label}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <CreateNotificationDialog />
            <Button onClick={() => setIsEditOpen(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Supplier
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="performance">Activity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><SupplierOverviewTab supplier={supplier} progress={progress} contractStatus={contract} /></TabsContent>
          <TabsContent value="compliance"><ComplianceTab supplier={supplier} progress={progress} /></TabsContent>
          <TabsContent value="performance"><PerformanceTab supplier={supplier} progress={progress} /></TabsContent>
          <TabsContent value="documents"><DocumentsTab supplierId={id!} /></TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EditSupplierModal open={isEditOpen} onOpenChange={setIsEditOpen} supplier={supplier}  />
      <SendAlertModal open={isAlertOpen} onOpenChange={setIsAlertOpen} supplierId={id!} supplierName={supplier.name} />
      {/* <ViewContractModal open={isContractOpen} onOpenChange={setIsContractOpen} documentUrl={supplier.contractDocument || ""} supplierName={supplier.name} /> */}
    </div>
  );
}