/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/planFeatures.ts
import { useGetMyUsageQuery } from "@/redux/features/myUsesLimit/my.uses.limit";

export type PlanFeatures = {
  editSupplier: boolean;
  fullAssessments: boolean;
  complianceDashboard: boolean;
  overallCompliance: boolean;
  emailSupport: boolean;
  prioritySupport: boolean;
  standardAlertsAndReminders: boolean;
  isAllFeaturesAccessible: boolean;
  apiAccess?: boolean;
  customWorkflows?: boolean;
  enterpriseSecurity?: boolean;
  dedicatedAccountManager?: boolean;

  documentReviewsPerMonth: number | null;
  reportsGeneratedPerMonth: number | null;
  messagesPerMonth: number | null;
  notificationsSend: number | null;
  reportCreate: number | null;
  supplierLimit: number | null
};


export function getPlanFeatures(subscription: any): PlanFeatures {
  const { data: Limit } = useGetMyUsageQuery(undefined);
  console.log("Limit Data in plan feature", Limit);
  const LimitData = Limit?.data?.limits;
  const features =
    subscription?.features ||
    subscription?.plan?.features ||
    {};

  return {
    isAllFeaturesAccessible: !features.isAllFeaturesAccessible,
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

    documentReviewsPerMonth: normalizeLimit(LimitData?.documentReviewsUsed),
    reportsGeneratedPerMonth: normalizeLimit(LimitData?.reportsGeneratedUsed),
    messagesPerMonth: normalizeLimit(LimitData?.messagesUsed),
    notificationsSend: normalizeLimit(LimitData?.notificationsSend),
    reportCreate: normalizeLimit(LimitData?.reportCreate),
    supplierLimit: normalizeLimit(LimitData?.suppliersUsed),
  };
}

function normalizeLimit(value: any): number | null {
  if (value === null) return null; // Unlimited
  return Number(value) || 0;
}
