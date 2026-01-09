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
    documentReviewsPerMonth: number,
    reportsGeneratedPerMonth: number,
    messagesPerMonth: number,
    notificationsSend: number,
    reportCreate: number,
};

export function getPlanFeatures(subscription: any): PlanFeatures {

  console.log("subscription",subscription);

    // ✅ Only grant permissions if subscription is active
    if (!subscription || subscription.status !== "ACTIVE") {
        return {
            editSupplier: false,
            fullAssessments: false,
            complianceDashboard: false,
            overallCompliance: false,
            emailSupport: false,
            prioritySupport: false,
            standardAlertsAndReminders: false,
            documentReviewsPerMonth: subscription?.documentReviewsPerMonth,
            reportsGeneratedPerMonth: subscription?.reportsGeneratedPerMonth,
            messagesPerMonth: subscription?.messagesPerMonth,
            notificationsSend: subscription?.notificationsSend,
            reportCreate: subscription?.reportCreate,
        };
    }

    const features = subscription.plan?.features ?? {};

    return {
        editSupplier: Boolean(features.editSupplier),
        fullAssessments: Boolean(features.fullAssessments),
        complianceDashboard: Boolean(features.complianceDashboard),
        overallCompliance: Boolean(features.overallCompliance),
        emailSupport: Boolean(features.emailSupport),
        prioritySupport: Boolean(features.prioritySupport),
        standardAlertsAndReminders: Boolean(features.standardAlertsAndReminders),
        documentReviewsPerMonth: subscription?.documentReviewsPerMonth,
        reportsGeneratedPerMonth: subscription?.reportsGeneratedPerMonth,
        messagesPerMonth: subscription?.messagesPerMonth,
        notificationsSend: subscription?.notificationsSend,
        reportCreate: subscription?.reportCreate,
    };
}
