// src/utils/notification.helper.ts
import type { Notification } from "@/types/notification";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileText,
  Clock,
  Bell,
  Calendar,
  MessageSquare,
  CreditCard,
  UserPlus,
  FileCheck,
} from "lucide-react";

// Get icon based on notification type
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'RISK_ALERT':
      return AlertCircle;
    case 'ASSESSMENT_APPROVED':
    case 'EVIDENCE_APPROVED':
    case 'INVITATION_ACCEPTED':
      return CheckCircle2;
    case 'ASSESSMENT_REJECTED':
    case 'EVIDENCE_REJECTED':
    case 'PAYMENT_FAILED':
    case 'SLA_BREACHED':
      return AlertTriangle;
    case 'CONTRACT_EXPIRY':
    case 'CONTRACT_EXPIRING_SOON':
      return Calendar;
    case 'ASSESSMENT_DUE':
      return Clock;
    case 'ASSESSMENT_SUBMITTED':
      return FileText;
    case 'PROBLEM_REPORTED':
    case 'PROBLEM_UPDATED':
    case 'PROBLEM_RESOLVED':
      return MessageSquare;
    case 'SYSTEM_ALERT':
      return Bell;
    case 'PAYMENT_SUCCESS':
      return CreditCard;
    case 'INVITATION_SENT':
      return UserPlus;
    case 'EVIDENCE_REQUESTED':
      return FileCheck;
    case 'REPORT_GENERATED':
      return FileText;
    default:
      return Info;
  }
};

// Get color based on type
export const getNotificationColor = (type: string) => {
  switch (type) {
    case 'RISK_ALERT':
    case 'ASSESSMENT_REJECTED':
    case 'EVIDENCE_REJECTED':
    case 'PAYMENT_FAILED':
    case 'SLA_BREACHED':
      return "text-destructive";
    case 'ASSESSMENT_APPROVED':
    case 'EVIDENCE_APPROVED':
    case 'INVITATION_ACCEPTED':
    case 'PROBLEM_RESOLVED':
    case 'PAYMENT_SUCCESS':
      return "text-green-600";
    case 'CONTRACT_EXPIRY':
    case 'ASSESSMENT_DUE':
    case 'PROBLEM_UPDATED':
      return "text-amber-600";
    case 'SYSTEM_ALERT':
    case 'REPORT_GENERATED':
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

// Get color based on priority
export const getNotificationPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return "bg-destructive/10 border-destructive/20 text-destructive";
    case 'MEDIUM':
      return "bg-amber-50 border-amber-200 text-amber-700";
    case 'LOW':
      return "bg-blue-50 border-blue-200 text-blue-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

// Get readable label
export const getNotificationTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    'RISK_ALERT': 'Risk Alert',
    'CONTRACT_EXPIRY': 'Contract Expiry',
    'CONTRACT_EXPIRING_SOON': 'Contract Expiring Soon',
    'ASSESSMENT_DUE': 'Assessment Due',
    'ASSESSMENT_SUBMITTED': 'Assessment Submitted',
    'ASSESSMENT_APPROVED': 'Assessment Approved',
    'ASSESSMENT_REJECTED': 'Assessment Rejected',
    'PROBLEM_REPORTED': 'Problem Reported',
    'PROBLEM_UPDATED': 'Problem Updated',
    'PROBLEM_RESOLVED': 'Problem Resolved',
    'SYSTEM_ALERT': 'System Alert',
    'PAYMENT_SUCCESS': 'Payment Successful',
    'PAYMENT_FAILED': 'Payment Failed',
    'REPORT_GENERATED': 'Report Generated',
    'INVITATION_SENT': 'Invitation Sent',
    'INVITATION_ACCEPTED': 'Invitation Accepted',
    'EVIDENCE_REQUESTED': 'Evidence Requested',
    'EVIDENCE_APPROVED': 'Evidence Approved',
    'EVIDENCE_REJECTED': 'Evidence Rejected',
    'SLA_BREACHED': 'SLA Breached',
  };
  
  return typeMap[type] || type;
};

// Format date nicely
export const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Generate action button info based on notification
export const getActionFromNotification = (notification: Notification): {
  label: string;
  path: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
} | null => {
  const { type, metadata } = notification;

  switch (type) {
    case 'ASSESSMENT_SUBMITTED':
    case 'ASSESSMENT_APPROVED':
    case 'ASSESSMENT_REJECTED':
      return {
        label: 'View Assessment',
        path: `/assessments/submissions/${metadata?.submissionId}`,
        variant: 'default'
      };
    case 'PROBLEM_REPORTED':
    case 'PROBLEM_UPDATED':
    case 'PROBLEM_RESOLVED':
      return {
        label: 'View Problem',
        path: `/problems/${metadata?.problemId}`,
        variant: 'default'
      };
    case 'EVIDENCE_REQUESTED':
    case 'EVIDENCE_REJECTED':
      return {
        label: 'Update Evidence',
        path: `/assessments/submissions/${metadata?.submissionId}`,
        variant: 'default'
      };
    case 'REPORT_GENERATED':
      return {
        label: 'View Report',
        path: `/reports/${metadata?.reportId}`,
        variant: 'default'
      };
    case 'CONTRACT_EXPIRING_SOON':
      return {
        label: 'View Supplier',
        path: `/suppliers/${metadata?.supplierId}`,
        variant: 'outline'
      };
    default:
      return null;
  }
};
