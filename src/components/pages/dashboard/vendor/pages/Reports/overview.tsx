/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/vendor/reports/page.tsx
import { useState } from 'react';
import {
    useGenerateReportMutation,
    useBulkGenerateReportsMutation,
    useGetReportsQuery,
    useGetReportByIdQuery,
    useDeleteReportMutation,
    useSendReportMutation,
    useGetReportDocumentMutation,
    useGetVendorReportOptionsQuery,
    useGetReportStatisticsQuery,
    useUpdateReportMutation
} from '@/redux/features/report/report.api';
import { useGetMySuppliersQuery } from '@/redux/features/vendor/vendor.api';
import {
    Download,
    Eye,
    Mail,
    Trash2,
    FileText,
    RefreshCw,

    Users,
    FileBarChart,

    Database,
    TrendingUp,
    AlertCircle,
    Clock,

    Send,

    Shield,
    Zap,
    FileCheck,
    FileWarning,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { getPlanFeatures } from '@/lib/planFeatures';

export default function VendorReportsPage() {
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [reportType, setReportType] = useState('RISK_ASSESSMENT');
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
    const [reportTitle, setReportTitle] = useState('');
    const [emailToSend, setEmailToSend] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch data
    const { data: reportsData, refetch: refetchReports, isLoading: reportsLoading } = useGetReportsQuery(undefined);
    const { data: suppliersData, isLoading: suppliersLoading } = useGetMySuppliersQuery(undefined);
    const { data: reportOptions, isLoading: optionsLoading } = useGetVendorReportOptionsQuery();
    const { data: statistics, isLoading: statsLoading } = useGetReportStatisticsQuery();
    const { data: reportDetails } = useGetReportByIdQuery(selectedReportId || '', {
        skip: !selectedReportId
    });
    // Mutations
    const [generateReport, { isLoading: generating }] = useGenerateReportMutation();
    const [bulkGenerate, { isLoading: bulkGenerating }] = useBulkGenerateReportsMutation();
    const [deleteReport, { isLoading: deleting }] = useDeleteReportMutation();
    const [sendReport, { isLoading: sending }] = useSendReportMutation();
    const [, { isLoading: downloading }] = useGetReportDocumentMutation();

    const [updateReport, { isLoading: updating }] = useUpdateReportMutation();

    // Process data
    const reports = reportsData?.data?.reports || reportsData?.data || [];
    const suppliers = suppliersData?.data || [];
    const stats = statistics?.data || {};
    const options = reportOptions?.data || {};
    // Filter reports based on active tab and search
    const filteredReports = reports.filter((report: any) => {
        const matchesTab = activeTab === 'all' || report.reportType === activeTab;
        const matchesSearch = searchQuery === '' ||
            report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.reportType.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Statistics calculations
    const totalReports = stats?.totalReports || 0;
    const recentReports = stats?.recentReports || [];
    const byType = stats?.byType || {};
    const byStatus = stats?.byStatus || {};
    const highRiskSuppliers = options?.highRiskSuppliers || 0;
    const overdueAssessments = options?.overdueAssessments || 0;
    const totalSuppliers = options?.totalSuppliers || suppliers.length || 0;
    const { data: userData } = useUserInfoQuery(undefined);
    const plan = userData?.data?.subscription;
      const permissions = getPlanFeatures(plan);
    
    // Report type icons
    const getReportTypeIcon = (type: string) => {
        switch (type) {
            case 'RISK_ASSESSMENT': return <Shield className="h-4 w-4" />;
            case 'COMPLIANCE_REPORT': return <FileCheck className="h-4 w-4" />;
            case 'SUPPLIER_EVALUATION': return <Users className="h-4 w-4" />;
            case 'SECURITY_AUDIT': return <Shield className="h-4 w-4" />;
            case 'PERFORMANCE_REVIEW': return <TrendingUp className="h-4 w-4" />;
            case 'INCIDENT_REPORT': return <AlertCircle className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    // Status badge variant
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'GENERATED': return 'default';
            case 'VIEWED': return 'secondary';
            case 'SENT': return 'outline';
            case 'ARCHIVED': return 'secondary';
            default: return 'outline';
        }
    };

    // ========== OPERATIONS ==========

    const handleGenerateReport = async () => {
        if (!reportTitle.trim()) {
            toast.error('Please enter a report title');
            return;
        }

        try {
            const payload = {
                title: reportTitle,
                reportType: reportType as any,
                supplierId: selectedSupplierId || undefined,
                description: `${reportType} report ${selectedSupplierId ? 'for supplier' : 'for all suppliers'}`,
                filters: {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    endDate: new Date().toISOString()
                }
            };
            console.log("payloade.....................", payload);
            const result = await generateReport(payload).unwrap();
            toast.success(`Report "${result.data?.title}" generated successfully!`);
            setReportTitle('');
            setSelectedSupplierId('');
            refetchReports();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to generate report');
            console.error(error);
        }
    };

    const handleGenerateVendorSummary = async () => {
        try {
            const payload = {
                title: `Vendor Summary - ${format(new Date(), 'MMM yyyy')}`,
                reportType: 'RISK_ASSESSMENT',
                description: 'Comprehensive vendor summary report for all suppliers'
            };

            const result = await generateReport(payload).unwrap();
            toast.success(`Vendor summary report "${result.data?.title}" generated!`);
            refetchReports();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to generate vendor summary');
        }
    };

    const handleBulkGenerate = async () => {
        try {
            const payload = {
                reportType: reportType as any,
                title: `Bulk ${reportType} Report`,
                description: `Bulk generated ${reportType.toLowerCase()} reports for all suppliers`,
                options: {
                    sendEmail: false,
                    includeRecommendations: true
                }
            };

            const result = await bulkGenerate(payload).unwrap();
            toast.success(`Generated ${result.data?.reports?.length || 0} reports`);
            refetchReports();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to bulk generate reports');
        }
    };

    const handleViewReport = async (reportId: string) => {
        // Find the report by ID
        const report = reports.find((r: any) => r.id === reportId);
        if (!report || !report.documentUrl) {
            toast.error('Report URL not found');
            return;
        }

        try {
            // Option 1: Direct download (saves as PDF)
            const link = document.createElement('a');
            link.href = report.documentUrl;
            link.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
            link.target = '_blank'; // Optional: opens in new tab if browser blocks download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Report downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download report');

            // Fallback: open in new tab (in case download is blocked)
            window.open(report.documentUrl, '_blank');
        }
    };

    const handleSendReport = async (reportId: string) => {
        if (!emailToSend.trim()) {
            toast.error('Please enter recipient email');
            return;
        }

        try {
            await sendReport({ reportId, recipientEmail: emailToSend }).unwrap();
            toast.success('Report sent successfully!');
            setEmailToSend('');
            setSelectedReportId(null);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to send report');
        }
    };

    const handleDeleteReport = async (reportId: string, reportTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${reportTitle}"?`)) return;

        try {
            await deleteReport(reportId).unwrap();
            toast.success('Report deleted successfully');
            refetchReports();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete report');
        }
    };

    const handleUpdateStatus = async (reportId: string, newStatus: string) => {
        try {
            await updateReport({
                reportId,
                body: { status: newStatus as any }
            }).unwrap();
            toast.success('Report status updated');
            refetchReports();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update status');
        }
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Loading state
    if (reportsLoading || suppliersLoading || statsLoading || optionsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className=" mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Report Management </h1>
                            <p className="text-gray-600 mt-2">Your Limit : {permissions.reportCreate} </p>
                            <p className="text-gray-600 mt-2">Generate, analyze, and manage reports for your suppliers</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetchReports()}
                                disabled={reportsLoading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${reportsLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleGenerateVendorSummary}
                                disabled={generating}
                            >
                                <FileBarChart className="h-4 w-4 mr-2" />
                                Quick Summary
                            </Button>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search reports by title or type..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reports</SelectItem>
                                <SelectItem value="RISK_ASSESSMENT">Risk Assessment</SelectItem>
                                <SelectItem value="COMPLIANCE_REPORT">Compliance</SelectItem>
                                <SelectItem value="SUPPLIER_EVALUATION">Supplier Eval</SelectItem>
                                <SelectItem value="SECURITY_AUDIT">Security Audit</SelectItem>
                                <SelectItem value="CUSTOM">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                                <FileBarChart className="h-4 w-4" />
                                Total Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900">{totalReports}</div>
                            <p className="text-xs text-blue-600 mt-1">
                                {byType.COMPLIANCE_REPORT?.count || 0} compliance, {byType.RISK_ASSESSMENT?.count || 0} risk
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Suppliers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-900">{totalSuppliers}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="destructive" className="text-xs">
                                    {highRiskSuppliers} High Risk
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    {overdueAssessments} Overdue
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                This Month
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-amber-900">{recentReports.length}</div>
                            <p className="text-xs text-amber-600 mt-1">
                                {byStatus.GENERATED || 0} generated, {byStatus.VIEWED || 0} viewed
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Report Generation Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-blue-600" />
                                Generate Reports
                            </CardTitle>
                            <CardDescription>
                                Create new reports for individual suppliers or all suppliers
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Report Title *</Label>
                                    <Input
                                        placeholder="e.g., Q4 2024 Risk Assessment"
                                        value={reportTitle}
                                        onChange={(e) => setReportTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Report Type</Label>
                                    <Select value={reportType} onValueChange={setReportType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="RISK_ASSESSMENT" className="flex items-center gap-2">
                                                <Shield className="h-4 w-4" /> Risk Assessment
                                            </SelectItem>
                                            <SelectItem value="COMPLIANCE_REPORT" className="flex items-center gap-2">
                                                <FileCheck className="h-4 w-4" /> Compliance Report
                                            </SelectItem>
                                            <SelectItem value="SUPPLIER_EVALUATION" className="flex items-center gap-2">
                                                <Users className="h-4 w-4" /> Supplier Evaluation
                                            </SelectItem>
                                            <SelectItem value="SECURITY_AUDIT" className="flex items-center gap-2">
                                                <Shield className="h-4 w-4" /> Security Audit
                                            </SelectItem>
                                            <SelectItem value="CUSTOM" className="flex items-center gap-2">
                                                <Shield className="h-4 w-4" /> Custom
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Supplier (Optional - leave empty for vendor summary)</Label>
                                <Select
                                    value={selectedSupplierId || undefined}
                                    onValueChange={setSelectedSupplierId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Suppliers (Vendor Summary)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((supplier: any) => (

                                            <SelectItem key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Button
                                    onClick={handleGenerateReport}
                                    disabled={generating || !reportTitle.trim()}
                                    className="w-full"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4 mr-2" />
                                            Generate Report
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={handleGenerateVendorSummary}
                                    disabled={generating}
                                    className="w-full"
                                    variant="secondary"
                                >
                                    <FileBarChart className="h-4 w-4 mr-2" />
                                    Vendor Summary
                                </Button>

                                <Button
                                    onClick={handleBulkGenerate}
                                    disabled={bulkGenerating}
                                    className="w-full"
                                    variant="outline"
                                >
                                    {bulkGenerating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Bulk...
                                        </>
                                    ) : (
                                        <>
                                            <Users className="h-4 w-4 mr-2" />
                                            Bulk Generate
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5 text-green-600" />
                                Quick Actions
                            </CardTitle>
                            <CardDescription>
                                Send, view, or manage existing reports
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Send Report via Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="recipient@company.com"
                                    value={emailToSend}
                                    onChange={(e) => setEmailToSend(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Select Report</Label>
                                <Select
                                    value={selectedReportId || ''}
                                    onValueChange={(value) => setSelectedReportId(value || null)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a report" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {recentReports.slice(0, 5).map((report: any) => (
                                            <SelectItem key={report.id} value={report.id}>
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="truncate">{report.title}</span>
                                                    <Badge variant={getStatusVariant(report.status)} className="ml-2 text-xs">
                                                        {report.status}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={() => selectedReportId && handleSendReport(selectedReportId)}
                                    disabled={!selectedReportId || !emailToSend || sending}
                                    className="w-full"
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Send
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={() => selectedReportId && handleViewReport(selectedReportId)}
                                    disabled={!selectedReportId || downloading}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {downloading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </>
                                    )}
                                </Button>
                            </div>

                            {selectedReportId && reportDetails?.data && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm font-medium mb-2">Selected Report:</p>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium truncate">{reportDetails.data.title}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {getReportTypeIcon(reportDetails.data.reportType)}
                                                {reportDetails.data.reportType}
                                            </Badge>
                                            <Badge variant={getStatusVariant(reportDetails.data.status)} className="text-xs">
                                                {reportDetails.data.status}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {formatFileSize(reportDetails.data.fileSize)}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Created {formatDistanceToNow(new Date(reportDetails.data.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Reports Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Recent Reports</CardTitle>
                                <CardDescription>
                                    {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {totalReports} Total
                                </Badge>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {byStatus.GENERATED || 0} New
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredReports.length === 0 ? (
                            <div className="text-center py-12">
                                <FileWarning className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                                <p className="text-gray-500 mb-4">
                                    {searchQuery ? 'Try a different search term' : 'Generate your first report above'}
                                </p>
                                <Button onClick={() => { setSearchQuery(''); setActiveTab('all'); }}>
                                    View All Reports
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[300px]">Title</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredReports.map((report: any) => (
                                            <TableRow key={report.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="font-medium truncate max-w-[280px]">
                                                        {report.title}
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {report.description || 'No description'}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getReportTypeIcon(report.reportType)}
                                                        <span className="text-sm">{report.reportType.replace(/_/g, ' ')}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {report.supplierId ? (
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm">
                                                                {suppliers.find((s: any) => s.id === report.supplierId)?.name || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs">
                                                            Vendor Summary
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={report.status}
                                                        onValueChange={(value) => handleUpdateStatus(report.id, value)}
                                                        disabled={updating}
                                                    >
                                                        <SelectTrigger className="h-8 w-32">
                                                            <div className="flex items-center gap-2">
                                                                {report.status === 'GENERATED' && <Clock className="h-3 w-3 text-blue-500" />}
                                                                {report.status === 'VIEWED' && <Eye className="h-3 w-3 text-green-500" />}
                                                                {report.status === 'SENT' && <Send className="h-3 w-3 text-purple-500" />}
                                                                {report.status === 'ARCHIVED' && <Database className="h-3 w-3 text-gray-500" />}
                                                                <span>{report.status}</span>
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="GENERATED">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-3 w-3" /> Generated
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="VIEWED">
                                                                <div className="flex items-center gap-2">
                                                                    <Eye className="h-3 w-3" /> Viewed
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="SENT">
                                                                <div className="flex items-center gap-2">
                                                                    <Send className="h-3 w-3" /> Sent
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="ARCHIVED">
                                                                <div className="flex items-center gap-2">
                                                                    <Database className="h-3 w-3" /> Archived
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{format(new Date(report.createdAt), 'MMM dd')}</span>
                                                        <span className="text-xs text-gray-500">
                                                            {format(new Date(report.createdAt), 'HH:mm')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {formatFileSize(report.fileSize)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewReport(report.id)}
                                                            title="Download"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedReportId(report.id);
                                                                setEmailToSend('');
                                                            }}
                                                            title="Send"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteReport(report.id, report.title)}
                                                            title="Delete"
                                                            disabled={deleting}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            {deleting ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                    {filteredReports.length > 0 && (
                        <CardFooter className="border-t bg-gray-50">
                            <div className="flex items-center justify-between w-full text-sm text-gray-500">
                                <div>
                                    Showing {filteredReports.length} of {reports.length} reports
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>
                                        <span className="font-medium text-green-600">{byStatus.SENT || 0}</span> sent,
                                        <span className="font-medium text-blue-600 ml-2">{byStatus.VIEWED || 0}</span> viewed
                                    </span>
                                    <Button variant="ghost" size="sm" onClick={() => refetchReports()}>
                                        <RefreshCw className="h-3 w-3 mr-1" />
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}