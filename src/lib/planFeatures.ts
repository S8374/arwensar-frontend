/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/planFeatures.ts

export type PlanFeatures = {
  editSupplier: boolean;
  fullAssessments: boolean;
  complianceDashboard: boolean;
  overallCompliance: boolean;
  emailSupport: boolean;
  prioritySupport: boolean;
  standardAlertsAndReminders: boolean;

  apiAccess?: boolean;
  customWorkflows?: boolean;
  enterpriseSecurity?: boolean;
  dedicatedAccountManager?: boolean;

  documentReviewsPerMonth: number | null;
  reportsGeneratedPerMonth: number | null;
  messagesPerMonth: number | null;
  notificationsSend: number | null;
  reportCreate: number | null;
};

export function getPlanFeatures(subscription: any): PlanFeatures {
  const features =
    subscription?.features ||
    subscription?.plan?.features ||
    {};

  return {
    editSupplier: !!features.editSupplier,
    fullAssessments: !!features.fullAssessments,
    complianceDashboard: !!features.complianceDashboard,
    overallCompliance: !!features.overallCompliance,
    emailSupport: !!features.emailSupport,
    prioritySupport: !!features.prioritySupport,
    standardAlertsAndReminders: !!features.standardAlertsAndReminders,

    apiAccess: !!features.apiAccess,
    customWorkflows: !!features.customWorkflows,
    enterpriseSecurity: !!features.enterpriseSecurity,
    dedicatedAccountManager: !!features.dedicatedAccountManager,

    documentReviewsPerMonth: normalizeLimit(features.documentReviewsPerMonth),
    reportsGeneratedPerMonth: normalizeLimit(features.reportsGeneratedPerMonth),
    messagesPerMonth: normalizeLimit(features.messagesPerMonth),
    notificationsSend: normalizeLimit(features.notificationsSend),
    reportCreate: normalizeLimit(features.reportCreate),
  };
}

function normalizeLimit(value: any): number | null {
  if (value === null) return null; // Unlimited
  if (value === undefined) return 0;
  return Number(value) || 0;
}
