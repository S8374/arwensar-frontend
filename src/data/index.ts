import type { Alert } from "@/types";

// data/dashboardData.ts
export const dashboardData = {
  user: { name: "Arwen" },
  complianceOverview: [
    { name: "Low Risk", value: 50, color: "#10b981" },
    { name: "Medium Risk", value: 30, color: "#f59e0b" },
    { name: "High Risk", value: 20, color: "#ef4444" },
  ],
  totalCompliant: 20,
  pending: 5,
  nonCompliant: 5,
  recentAlerts: [
    { id: 1, supplier: "TechSupply Solutions", message: "Contract expiring in 12 days", level: "high" },
    { id: 2, supplier: "DataCore", message: "High risk detected", level: "high" },
  ],
  suppliers: [
    { name: "TechSupply Solutions", category: "IT Services", contractExpiry: "1/15/2025", compliance: "Compliant" as const, riskLevel: "Low Risk" as const, riskScore: 25 },
    { name: "DataCore Systems", category: "Data Management", contractExpiry: "12/31/2024", compliance: "Pending" as const, riskLevel: "Medium Risk" as const, riskScore: 55 },
    { name: "SecureNet Inc.", category: "Cybersecurity", contractExpiry: "6/10/2024", compliance: "Non-Compliant" as const, riskLevel: "High Risk" as const, riskScore: 82 },
  ],
};

// data/stats-data.ts
export const statsData = [
  {
    title: "Total Suppliers",
    value: 50,
    change: "12% from last month",
    changeType: "positive",
    icon: "Users",
    iconColor: "text-foreground",
    bgColor: "bg-chart-2/50",
  },
  {
    title: "High Risk Suppliers",
    value: 5,
    change: "2 new this week",
    changeType: "negative",
    icon: "AlertTriangle",
    iconColor: "text-foreground",
    bgColor: "bg-chart-1/20",
  },
  {
    title: "Expiring Contracts",
    value: 0,
    icon: "FileClock",
    iconColor: "text-foreground",
    bgColor: "bg-chart-2/50",
  },
  {
    title: "NIS2 Compliance",
    value: 50,
    change: "15% improvement",
    changeType: "positive",
    icon: "ShieldCheck",
    iconColor: "text-foreground",
    bgColor: "bg-chart-2/50",
  },
];




export const alerts: Alert[] = [
  {
    id: "1",
    type: "error",
    title: "Document Expired",
    description: "Security Certificate expired 5 days ago",
    date: new Date("2025-02-01"),
  },
  {
    id: "2",
    type: "warning",
    title: "Evidence Required",
    description: "Data Security Assessment requires 3 more documents",
    date: new Date("2025-02-12"),
  },
  {
    id: "3",
    type: "error",
    title: "High Risk Detected",
    description: "Access Control score below threshold (45%)",
    date: new Date("2025-02-13"),
  },
  {
    id: "4",
    type: "warning",
    title: "Assessment Deadline",
    description: "Risk Management Assessment due in 3 days",
    date: new Date("2025-02-14"),
  },
  {
    id: "5",
    type: "success",
    title: "Score Improved",
    description: "Your overall compliance score increased to 82%",
    date: new Date("2025-01-08"),
    resolved: true,
  },
  {
    id: "6",
    type: "success",
    title: "Document Approved",
    description: "ISO 27001 Certificate has been approved",
    date: new Date("2025-02-06"),
    resolved: true,
  },
];