/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/notification.ts
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, any>;
  isRead: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'RISK_ALERT'
  | 'CONTRACT_EXPIRY'
  | 'ASSESSMENT_DUE'
  | 'ASSESSMENT_SUBMITTED'
  | 'PROBLEM_REPORTED'
  | 'PROBLEM_UPDATED'
  | 'PROBLEM_RESOLVED'
  | 'SYSTEM_ALERT'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'REPORT_GENERATED'
  | 'INVITATION_SENT'
  | 'INVITATION_ACCEPTED'
  | 'ASSESSMENT_APPROVED'
  | 'ASSESSMENT_REJECTED'
  | 'EVIDENCE_REQUESTED'
  | 'EVIDENCE_APPROVED'
  | 'EVIDENCE_REJECTED'
  | 'CONTRACT_EXPIRING_SOON'
  | 'SLA_BREACHED';

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface MarkAsReadPayload {
  notificationIds?: string[];
  markAll?: boolean;
}