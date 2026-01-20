/* eslint-disable @typescript-eslint/no-unused-vars */
// WorkflowDetailsPage.tsx - Detailed workflow explanation page
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Mail,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart,
    LogIn,
    Upload,
    Eye,
    Calendar,
    Shield,
    Users,
    Clock,
    TrendingDown,
    Bell,
    FileCheck,
    Send
} from 'lucide-react';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { getPlanFeatures } from '@/lib/planFeatures';
import FeatureRestricted from '@/components/upgrade/FeatureRestricted';

const WorkflowDetailsPage = () => {
    const workflowSteps = [
        {
            step: 1,
            title: "Supplier Invitation & Onboarding",
            icon: <Mail className="h-6 w-6" />,
            color: "bg-blue-100 text-blue-600",
            details: [
                "Vendor sends email invitation to supplier",
                "Email contains secure account creation link",
                "Supplier clicks link and fills registration form",
                "System creates supplier account automatically",
                "Supplier receives login credentials via email"
            ],
            notes: "Suppliers cannot register without invitation link from vendor"
        },
        {
            step: 2,
            title: "Supplier Login & Dashboard Access",
            icon: <LogIn className="h-6 w-6" />,
            color: "bg-green-100 text-green-600",
            details: [
                "Supplier logs in with provided credentials",
                "Accesses personalized dashboard",
                "Views pending assignments from vendor",
                "Sees deadlines and requirements clearly",
                "Can view previous submissions history"
            ],
            notes: "First login requires password change for security"
        },
        {
            step: 3,
            title: "Assignment Completion & Submission",
            icon: <Upload className="h-6 w-6" />,
            color: "bg-purple-100 text-purple-600",
            details: [
                "Supplier views assignment details",
                "Completes required tasks/questions",
                "Uploads supporting documents if needed",
                "Reviews submission before sending",
                "Submits assignment for vendor review"
            ],
            notes: "Assignments have submission deadlines - late submissions affect scores"
        },
        {
            step: 4,
            title: "Vendor Review & Assessment",
            icon: <Eye className="h-6 w-6" />,
            color: "bg-amber-100 text-amber-600",
            details: [
                "Vendor receives notification of submission",
                "Reviews assignment thoroughly",
                "Checks for completeness and accuracy",
                "Evaluates against quality standards",
                "Makes decision: Approve or Reject"
            ],
            consequences: {
                approve: "Assignment marked complete, supplier score maintained",
                reject: "Supplier score decreases, requires resubmission"
            }
        },
        {
            step: 5,
            title: "Document Evidence Management",
            icon: <FileCheck className="h-6 w-6" />,
            color: "bg-indigo-100 text-indigo-600",
            details: [
                "Supplier uploads supporting evidence",
                "Documents include certificates, reports, proofs",
                "Vendor reviews each document",
                "Verifies authenticity and validity",
                "Approves or requests additional documents"
            ],
            notes: "All documents are stored securely with version history"
        },
        {
            step: 6,
            title: "Contract Lifecycle Management",
            icon: <Calendar className="h-6 w-6" />,
            color: "bg-red-100 text-red-600",
            details: [
                "System tracks contract expiry dates",
                "Automatic notifications sent 30/15/7 days before expiry",
                "Creates problem discussion for renewal",
                "Vendor and supplier discuss terms",
                "Contract renewal process initiated"
            ],
            notes: "Expired contracts trigger supplier suspension"
        },
        {
            step: 7,
            title: "Reporting & Analytics",
            icon: <BarChart className="h-6 w-6" />,
            color: "bg-emerald-100 text-emerald-600",
            details: [
                "Generate reports for specific supplier",
                "Create overall supplier performance report",
                "Export data in PDF/Excel formats",
                "Send reports via email directly",
                "View historical performance trends"
            ],
            notes: "Reports include scoring, compliance status, and recommendations"
        }
    ];

    const systemFeatures = [
        {
            title: "Supplier Scoring System",
            description: "Dynamic scoring based on performance, compliance, and timeliness",
            details: [
                "Base score: 100 points",
                "+10 points: Early submission",
                "+5 points: Excellent quality",
                "-10 points: Rejected assignment",
                "-5 points: Late submission",
                "-15 points: Document non-compliance"
            ],
            icon: <TrendingDown className="h-5 w-5" />
        },
        {
            title: "Notification System",
            description: "Automatic alerts for all critical activities",
            details: [
                "Email notifications for invitations",
                "Dashboard alerts for pending reviews",
                "Contract expiry warnings",
                "Submission deadline reminders",
                "Approval/rejection notifications"
            ],
            icon: <Bell className="h-5 w-5" />
        },
        {
            title: "Document Management",
            description: "Secure storage and version control",
            details: [
                "All documents encrypted",
                "Version history maintained",
                "Approval trails documented",
                "Expiry tracking for certificates",
                "Automatic archiving"
            ],
            icon: <Shield className="h-5 w-5" />
        }
    ];

    const approvalWorkflow = [
        {
            action: "Assignment Submitted",
            status: "Pending Review",
            timeline: "Immediate",
            responsible: "Vendor"
        },
        {
            action: "Initial Review",
            status: "In Progress",
            timeline: "Within 48 hours",
            responsible: "Vendor"
        },
        {
            action: "Quality Check",
            status: "Optional",
            timeline: "If required",
            responsible: "Quality Team"
        },
        {
            action: "Final Decision",
            status: "Approve/Reject",
            timeline: "Within 72 hours",
            responsible: "Vendor"
        },
        {
            action: "Notification Sent",
            status: "Completed",
            timeline: "Immediate",
            responsible: "System"
        }
    ];
    const { data: userData } = useUserInfoQuery(undefined);
    const plan = userData?.data?.subscription;

    const permissions = getPlanFeatures(plan);
    return (

        <div>
            {
                permissions.customWorkflows ?
                    <div className="container mx-auto p-6 ">
                        {/* Header */}
                        <div className=" mb-10">
                            <h1 className="text-4xl font-bold tracking-tight mb-3 "> Workflow System     
                            </h1>
                            <p className="text-xl text-muted-foreground  mx-auto">
                                Complete visual guide to understanding how the supplier management system works
                            </p>
                        </div>

                        {/* Introduction */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>System Overview</CardTitle>
                                <CardDescription>
                                    This platform streamlines vendor-supplier interactions through automated workflows,
                                    ensuring transparency, accountability, and efficient communication throughout the partnership lifecycle.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="inline-flex p-3 bg-blue-100 rounded-full mb-3">
                                            <Users className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold mb-1">Supplier Management</h3>
                                        <p className="text-sm text-muted-foreground">End-to-end supplier lifecycle control</p>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="inline-flex p-3 bg-green-100 rounded-full mb-3">
                                            <FileText className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold mb-1">Document Control</h3>
                                        <p className="text-sm text-muted-foreground">Secure document verification system</p>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="inline-flex p-3 bg-purple-100 rounded-full mb-3">
                                            <Clock className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold mb-1">Timeline Tracking</h3>
                                        <p className="text-sm text-muted-foreground">Real-time progress monitoring</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Main Workflow Steps */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                Complete Workflow Process
                            </h2>

                            <div className="space-y-8">
                                {workflowSteps.map((step, _index) => (
                                    <Card key={step.step} className="relative overflow-hidden">
                                        <div className={`absolute left-0 top-0 h-full w-1 ${step.color.split(' ')[0]}`} />

                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`${step.color} rounded-full p-3`}>
                                                        {step.icon}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="secondary">Step {step.step}</Badge>
                                                            <CardTitle className="text-xl">{step.title}</CardTitle>
                                                        </div>
                                                        <CardDescription className="mt-2">
                                                            Detailed process description and requirements
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Process Details */}
                                                <div>
                                                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                                                        Process Details
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {step.details.map((detail, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 mt-0.5 flex-shrink-0">
                                                                    <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                                                                </div>
                                                                <span>{detail}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {step.notes && (
                                                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                                            <div className="flex items-center gap-2 text-amber-800 mb-1">
                                                                <AlertCircle className="h-4 w-4" />
                                                                <span className="font-medium">Important Note</span>
                                                            </div>
                                                            <p className="text-sm text-amber-700">{step.notes}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Consequences / Additional Info */}
                                                <div>
                                                    {step.consequences ? (
                                                        <>
                                                            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                                                                Decision Consequences
                                                            </h4>
                                                            <div className="space-y-4">
                                                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                                                    <div className="flex items-center gap-2 text-green-800 mb-1">
                                                                        <CheckCircle className="h-4 w-4" />
                                                                        <span className="font-medium">Approval</span>
                                                                    </div>
                                                                    <p className="text-sm text-green-700">{step.consequences.approve}</p>
                                                                </div>
                                                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                                                    <div className="flex items-center gap-2 text-red-800 mb-1">
                                                                        <XCircle className="h-4 w-4" />
                                                                        <span className="font-medium">Rejection</span>
                                                                    </div>
                                                                    <p className="text-sm text-red-700">{step.consequences.reject}</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                                                                System Behavior
                                                            </h4>
                                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                                                                <p className="text-sm text-slate-700">
                                                                    This step triggers automated system notifications and updates
                                                                    supplier status in real-time. All actions are logged for audit purposes.
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-10" />

                        {/* Key System Features */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold mb-6">Key System Features</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {systemFeatures.map((feature, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-primary/10 rounded-md">
                                                    {feature.icon}
                                                </div>
                                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                            </div>
                                            <CardDescription>{feature.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {feature.details.map((detail, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 mt-0.5 flex-shrink-0">
                                                            <CheckCircle className="h-3 w-3 text-primary" />
                                                        </div>
                                                        <span className="text-sm">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Approval Workflow */}
                        <Card className="mb-10">
                            <CardHeader>
                                <CardTitle>Standard Approval Workflow</CardTitle>
                                <CardDescription>
                                    Typical timeline and responsible parties for assignment reviews
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    {/* Timeline connector */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />

                                    <div className="space-y-6">
                                        {approvalWorkflow.map((step, index) => (
                                            <div key={index} className="relative flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center
                      ${step.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                                            step.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                                                                'bg-slate-100 text-slate-600'}`}>
                                                        <span className="font-semibold">{index + 1}</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 pt-2">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold">{step.action}</h4>
                                                        <Badge variant={
                                                            step.status === 'Completed' ? 'default' :
                                                                step.status === 'In Progress' ? 'secondary' : 'outline'
                                                        }>
                                                            {step.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Timeline: {step.timeline}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Users className="h-4 w-4" />
                                                            <span>Responsible: {step.responsible}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    System Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground">
                                        This workflow system ensures complete transparency between vendor and supplier.
                                        Every action is tracked, documented, and timestamped. The automated notifications
                                        keep all parties informed, while the scoring system maintains quality standards.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-3 bg-white border rounded-lg">
                                            <h4 className="font-semibold mb-2">Vendor Benefits</h4>
                                            <ul className="text-sm space-y-1">
                                                <li>• Complete supplier performance tracking</li>
                                                <li>• Automated deadline management</li>
                                                <li>• Centralized document repository</li>
                                                <li>• Real-time status updates</li>
                                            </ul>
                                        </div>
                                        <div className="p-3 bg-white border rounded-lg">
                                            <h4 className="font-semibold mb-2">Supplier Benefits</h4>
                                            <ul className="text-sm space-y-1">
                                                <li>• Clear expectations and requirements</li>
                                                <li>• Direct communication channel</li>
                                                <li>• Performance feedback and scoring</li>
                                                <li>• Contract renewal reminders</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    :
                    <FeatureRestricted
                        title="Custom Work Flow"
                        description="Enable API integration to connect your system with our platform."
                        requiredPlan="enterprise"
                        feature="apiAccess"
                    />
            }

        </div>

    );
};

export default WorkflowDetailsPage;