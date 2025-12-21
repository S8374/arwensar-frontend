import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  AlertCircle, 
  FileText, 
  Edit2, 
  Bell, 
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { useParams } from "react-router-dom";
import NIS2AssessmentStatus from "./component/NIS2AssessmentStatus";
import SupplierAlerts from "./component/SupplierAlerts";
import AssessmentHistory from "./component/AssessmentHistory";
import { useEffect, useState } from "react";
import EditSupplierModal from "./model/EditSupplierModal";
import SendAlertModal from "./model/SendAlertModal";
import { useGetSupplierByIdQuery, useLazyGetSingelSupplyerProgressQuery } from "@/redux/features/vendor/vendor.api";
import ViewContractModal from "./model/ViewContractModal";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to determine NIS2 status
const getNIS2Status = (progress: any) => {
  if (!progress) return { status: "Unknown", badge: "default", icon: Clock };
  
  const isCompletedAll = progress.data?.isCompletedAll;
  const completedAssessments = progress.data?.completedAssessments || 0;
  const totalAssessments = progress.data?.totalAssessments || 0;
  
  if (isCompletedAll) {
    return { 
      status: "Compliant", 
      badge: "success", 
      icon: CheckCircle,
      description: `${completedAssessments}/${totalAssessments} assessments completed`
    };
  } else {
    return { 
      status: "Incomplete", 
      badge: "warning", 
      icon: XCircle,
      description: `${completedAssessments}/${totalAssessments} assessments completed`
    };
  }
};

// Helper function to format BIV score
const formatBIVScore = (score: number | undefined) => {
  if (score === undefined || score === null) return "N/A";
  return score.toFixed(1);
};

// Helper function to determine risk badge variant
const getRiskBadgeVariant = (riskLevel: string | undefined) => {
  if (!riskLevel) return "outline";
  
  const level = riskLevel.toLowerCase();
  if (level.includes('high')) return "destructive";
  if (level.includes('medium')) return "secondary";
  if (level.includes('low')) return "success";
  return "outline";
};

// Helper function to get risk color
const getRiskColor = (riskLevel: string | undefined) => {
  if (!riskLevel) return "text-gray-500";
  
  const level = riskLevel.toLowerCase();
  if (level.includes('high')) return "text-destructive";
  if (level.includes('medium')) return "text-primary";
  if (level.includes('low')) return "text-green";
  return "text-gray-500";
};

// Helper function to get criticality badge variant
const getCriticalityBadgeVariant = (criticality: string | undefined) => {
  if (!criticality) return "outline";
  
  const level = criticality.toLowerCase();
  if (level.includes('high')) return "destructive";
  if (level.includes('medium')) return "secondary";
  if (level.includes('low')) return "default";
  return "outline";
};

export default function SupplierDetailPage() {
  const { id } = useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch supplier data
  const { 
    data: supplierData, 
    isLoading: supplierLoading, 
    error: supplierError 
  } = useGetSupplierByIdQuery(id!, {
    skip: !id,
  });

  // Fetch vendor data
  const { data: vendor } = useUserInfoQuery(undefined);

  // Fetch progress data
  const [getProgress, { data: progress, isLoading: progressLoading }] =
    useLazyGetSingelSupplyerProgressQuery();

  useEffect(() => {
    if (id) {
      getProgress(id);
    }
  }, [id, getProgress]);

  // Calculate contract days
  const contractStart = supplierData?.data?.contractStartDate
    ? new Date(supplierData.data.contractStartDate)
    : null;

  const contractEnd = supplierData?.data?.contractEndDate
    ? new Date(supplierData.data.contractEndDate)
    : null;

  const today = new Date();
  const daysUntilExpiry = contractEnd
    ? Math.ceil((contractEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const isExpired = daysUntilExpiry < 0;
  const isExpiringSoon = daysUntilExpiry <= 90 && daysUntilExpiry >= 0;

  const formattedStartDate = contractStart
    ? contractStart.toLocaleDateString("en-GB")
    : "N/A";

  const formattedEndDate = contractEnd
    ? contractEnd.toLocaleDateString("en-GB")
    : "N/A";

  // Get NIS2 status
  const nis2Status = getNIS2Status(progress);
  const StatusIcon = nis2Status.icon;

  // Loading state
  if (supplierLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // Error state
  if (supplierError) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold text-destructive">Error Loading Supplier Data</h2>
              <p className="text-muted-foreground mt-2">
                Unable to load supplier information. Please try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {supplierData?.data?.name || "Supplier Name"}
              </h1>
              <Badge variant="outline" className="text-sm font-normal">
                ID: {supplierData?.data?.supplierId?.slice(0, 8) || "N/A"}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-muted-foreground flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getRiskColor(progress?.data?.riskLevel)}`}></span>
                {supplierData?.data?.category || "Category"}
              </p>
              <span className="text-muted-foreground">•</span>
              <p className="text-muted-foreground">
                Vendor: {progress?.data?.vendorName || supplierData?.data?.vendor?.companyName || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsAlertOpen(true)}>
              <Bell className="w-4 h-4 mr-2" />
              Send Alert
            </Button>
            <Button 
              size="sm" 
              className="bg-chart-6 hover:bg-chart-6/90"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Supplier
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Contact Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Primary Contact</p>
                  <p className="font-semibold">
                    {supplierData?.data?.contactPerson || "Not specified"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {supplierData?.data?.email || supplierData?.data?.vendor?.businessEmail || "No email"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {supplierData?.data?.phone || "No phone"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Contract Status</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={isExpired ? "destructive" : isExpiringSoon ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Active"}
                      </Badge>
                      <p className={`font-bold text-lg ${isExpired ? "text-destructive" : isExpiringSoon ? "text-primary" : "text-green"}`}>
                        {isExpired ? `Expired ${Math.abs(daysUntilExpiry)} days ago` : `${daysUntilExpiry} days`}
                      </p>
                    </div>
                    <p className="text-sm">
                      Ends: {formattedEndDate}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk & BIV Score Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 ${getRiskColor(progress?.data?.riskLevel).replace('text-', 'bg-')}/20 rounded-lg`}>
                  <AlertCircle className={`w-6 h-6 ${getRiskColor(progress?.data?.riskLevel)}`} />
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <div className="space-y-2">
                    <Badge 
                      variant={getRiskBadgeVariant(progress?.data?.riskLevel)}
                      className="font-medium"
                    >
                      {progress?.data?.riskLevel || "Unknown"}
                    </Badge>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Overall BIV Score</p>
                      <div className="flex items-baseline gap-2">
                        <p className="font-bold text-2xl">
                          {formatBIVScore(progress?.data?.overallBIVScore)}
                        </p>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NIS2 Compliance Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 ${nis2Status.badge === "success" ? "bg-green/20" : "bg-yellow-500/20"} rounded-lg`}>
                  <Shield className={`w-6 h-6 ${nis2Status.badge === "success" ? "text-green" : "text-yellow-600"}`} />
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">NIS2 Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${nis2Status.badge === "success" ? "text-green" : "text-yellow-600"}`} />
                      <Badge 
                        variant={nis2Status.badge === "success" ? "success" : "warning"}
                        className="font-medium"
                      >
                        {nis2Status.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {nis2Status.description}
                    </p>
                    <Progress 
                      value={progress?.data?.progressPercent || 0} 
                      className="h-2"
                      indicatorClassName={progress?.data?.progressPercent === 100 ? "bg-green" : "bg-primary"}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Assessments</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-2xl">
                    {progress?.data?.completedAssessments || 0}/{progress?.data?.totalAssessments || 0}
                  </p>
                  <Badge 
                    variant={progress?.data?.completedAssessments === progress?.data?.totalAssessments ? "success" : "secondary"}
                    className="text-xs"
                  >
                    {progress?.data?.progressPercent || 0}%
                  </Badge>
                </div>
                <p className="text-sm">
                  {progress?.data?.pendingAssessments || 0} pending
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Document Compliance</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-2xl">
                    {progress?.data?.documentsSubmitted || 0}/{progress?.data?.totalDocumentQuestions || 0}
                  </p>
                  <Badge 
                    variant={progress?.data?.documentComplianceRate === 100 ? "success" : "secondary"}
                    className="text-xs"
                  >
                    {progress?.data?.documentComplianceRate || 0}%
                  </Badge>
                </div>
                <p className="text-sm">
                  {progress?.data?.missingDocuments || 0} missing
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Risk Distribution</p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-bold text-xl text-green">
                      {progress?.data?.riskDistribution?.lowRisk || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Low</p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="text-center">
                    <p className="font-bold text-xl text-primary">
                      {progress?.data?.riskDistribution?.mediumRisk || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Medium</p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="text-center">
                    <p className="font-bold text-xl text-destructive">
                      {progress?.data?.riskDistribution?.highRisk || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">High</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Tabs Section */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - General Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="font-semibold">
                        {progress?.data?.vendorName || supplierData?.data?.vendor?.companyName || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-semibold">{supplierData?.data?.category || "N/A"}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-semibold">{supplierData?.data?.contactPerson || "N/A"}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-semibold text-chart-6">
                        {supplierData?.data?.email || supplierData?.data?.vendor?.businessEmail || "N/A"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-semibold">{supplierData?.data?.phone || "N/A"}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Criticality Level</p>
                      <Badge 
                        variant={getCriticalityBadgeVariant(supplierData?.data?.criticality)}
                        className="mt-1"
                      >
                        {supplierData?.data?.criticality || "N/A"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Contract Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Contract Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Contract Start Date</p>
                      <p className="font-semibold">{formattedStartDate}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Contract End Date</p>
                      <p className="font-semibold">{formattedEndDate}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={isExpired ? "destructive" : isExpiringSoon ? "secondary" : "default"}
                          className="text-sm"
                        >
                          {isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Active"}
                        </Badge>
                        <p className={`font-semibold ${isExpired ? "text-destructive" : isExpiringSoon ? "text-primary" : "text-green"}`}>
                          {isExpired ? `Expired ${Math.abs(daysUntilExpiry)} days ago` : `${daysUntilExpiry} days remaining`}
                        </p>
                      </div>
                    </div>
                    
                    {progress?.data?.lastActivity && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Last Activity</p>
                        <p className="font-semibold">
                          {new Date(progress.data.lastActivity).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                    
                    {progress?.data?.recommendations && progress.data.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Recommendations</p>
                        <ul className="space-y-1">
                          {progress.data.recommendations.slice(0, 2).map((rec: string, index: number) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => setIsViewModalOpen(true)}
                    disabled={!supplierData?.data?.documentUrl}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {supplierData?.data?.documentUrl ? "View Contract Document" : "No Contract Document"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>NIS2 Compliance Assessment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Overall Compliance Score: <span className="font-semibold">{progress?.data?.averageComplianceScore || 0}%</span>
                </p>
              </CardHeader>
              <CardContent>
                <NIS2AssessmentStatus supplyer={supplierData} progress={progress} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              
              <CardContent>
                <SupplierAlerts data={vendor} supplierId={id} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
            
              <CardContent>
                <AssessmentHistory supplyer={supplierData} progress={progress} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EditSupplierModal 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        supplier={supplierData?.data} 
      />
      
      <SendAlertModal 
        open={isAlertOpen} 
        onOpenChange={setIsAlertOpen} 
        supplierId={id}
        supplierName={supplierData?.data?.name}
      />
      
      <ViewContractModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        documentUrl={supplierData?.data?.documentUrl}
        supplierName={supplierData?.data?.name}
      />
    </div>
  );
}