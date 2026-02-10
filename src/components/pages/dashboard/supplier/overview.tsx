/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Shield, AlertTriangle, FileCheck, Phone, Mail, Target, Activity, Award, RefreshCw, Building } from "lucide-react";
import { useGetSupplierDashboardQuery } from "@/redux/features/supplyer/supplyer.api";
import ComplianceTable from "./components/overviewComponent/Compliancetable";
import {  format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupplierDashboard() {
  const { data: dashboardData, isLoading, refetch } = useGetSupplierDashboardQuery();
  if (isLoading) return <DashboardSkeleton />;

  const data = dashboardData?.data || {};
  const supplierInfo = data.supplierInfo || {};
  const vendorInfo = data.myVendor || {};
  const contractInfo = data.contractInfo || {};
  const assessmentStats = data.assessmentStats || {};
  const riskStats = data.riskStats || {};
  const performanceStats = data.performanceStats || {};
  const documentStats = data.documentStats || {};
  const problemStats = data.problemStats || {};
 // const recentActivity = data.recentActivity || {};

  const overallCompletion = assessmentStats.totalAssessments > 0
    ? Math.round((assessmentStats.completedAssessments / assessmentStats.totalAssessments) * 100)
    : 0;

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };



  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {supplierInfo.contactPerson || "Supplier"} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor your compliance progress, assessments, and contracts</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-1"><Target className="w-4 h-4" /> Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mb-1">{overallCompletion}%</div>
            <Progress value={overallCompletion} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">{assessmentStats.completedAssessments} of {assessmentStats.totalAssessments} assessments completed</p>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${getRiskLevelColor(riskStats.riskLevel)} px-2 py-1 text-xs`}>{riskStats.riskLevel || "Not Assessed"}</Badge>
            <p className="text-xs text-muted-foreground mt-1">BIV Score: {riskStats.bivScore || 0}</p>
          </CardContent>
        </Card>

        <Card className={`${contractInfo.isExpiringSoon }`}>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-1"><FileCheck className="w-4 h-4" /> Contract Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold">{contractInfo.isExpired ? "Expired" : contractInfo.isExpiringSoon ? "Expiring" : "Active"}</div>
            {contractInfo.contractEndDate && <div className="text-xs text-muted-foreground">Ends: {format(new Date(contractInfo.contractEndDate), 'MMM dd, yyyy')}</div>}
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-1"><Award className="w-4 h-4" /> Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold">{performanceStats.overallScore || 0}%</div>
            <span className="text-xs text-muted-foreground capitalize">{performanceStats.improvementTrend?.toLowerCase() || 'Stable'} trend</span>
          </CardContent>
        </Card>
      </div>

      {/* Vendor, Quick Stats, Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vendor Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1"><Building className="w-5 h-5" /> Vendor Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                {vendorInfo.companyLogo ? <img src={vendorInfo.companyLogo} alt={vendorInfo.companyName} className="w-14 h-14 object-contain" /> : <Building className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold">{vendorInfo.companyName || "No Vendor Assigned"}</h3>
                <p className="text-xs text-muted-foreground">{vendorInfo.industryType || "Industry not specified"}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {vendorInfo.email || "N/A"}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {vendorInfo.contactNumber || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1"><Activity className="w-5 h-5" /> Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between"><span>Documents</span> <Badge>{documentStats.totalDocuments || 0}</Badge></div>
            <div className="flex justify-between"><span>Problems</span> <Badge>{problemStats.totalProblems || 0}</Badge></div>
            <div className="flex justify-between"><span>Assessments</span> <Badge>{assessmentStats.completedAssessments || 0}</Badge></div>
          </CardContent>
        </Card>

        {/* Risk Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1"><Shield className="w-5 h-5" /> Risk Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between"><span>Business</span> <span>{riskStats.businessScore || 0}%</span></div>
            <Progress value={riskStats.businessScore || 0} className="h-2"/>
            <div className="flex justify-between"><span>Integrity</span> <span>{riskStats.integrityScore || 0}%</span></div>
            <Progress value={riskStats.integrityScore || 0} className="h-2"/>
            <div className="flex justify-between"><span>Availability</span> <span>{riskStats.availabilityScore || 0}%</span></div>
            <Progress value={riskStats.availabilityScore || 0} className="h-2"/>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Overview & Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1"><BarChart3 className="w-5 h-5" /> Assessment Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-2 bg-blue-50 rounded text-center"><div className="font-bold">{assessmentStats.totalAssessments || 0}</div><div className="text-xs">Start Assignment</div></div>
            <div className="p-2 bg-amber-50 rounded text-center"><div className="font-bold">{assessmentStats.pendingAssessments || 0}</div><div className="text-xs">Pending</div></div>
            <div className="p-2 bg-green-50 rounded text-center"><div className="font-bold">{assessmentStats.completedAssessments || 0}</div><div className="text-xs">Completed</div></div>
          </div>

          <ComplianceTable />
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton Loader
function DashboardSkeleton() {
  return <div className="p-4 space-y-6"><Skeleton className="h-8 w-64" /><Skeleton className="h-6 w-80" /><Skeleton className="h-10 w-full"/></div>;
}
