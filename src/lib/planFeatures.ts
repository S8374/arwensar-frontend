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
    documentReviewsPerMonth: number;
    reportsGeneratedPerMonth: number;
    messagesPerMonth: number;
    notificationsSend: number;
    reportCreate: number;
};

export function getPlanFeatures(subscription: any): PlanFeatures {
    console.log("subscription object:", subscription);

    if (!subscription) {
        console.log("No subscription found");
        return getDefaultFeatures();
    }

    // Check if subscription has features directly (your current structure)
    const features = subscription.features || {};
    console.log("features object:", features);

    // For backward compatibility, also check subscription.plan?.features
    const planFeatures = subscription.plan?.features || {};

    // Merge both feature sources (direct features take priority)
    const allFeatures = { ...planFeatures, ...features };

    return {
        editSupplier: Boolean(allFeatures.editSupplier),
        fullAssessments: Boolean(allFeatures.fullAssessments),
        complianceDashboard: Boolean(allFeatures.complianceDashboard),
        overallCompliance: Boolean(allFeatures.overallCompliance),
        emailSupport: Boolean(allFeatures.emailSupport),
        prioritySupport: Boolean(allFeatures.prioritySupport),
        standardAlertsAndReminders: Boolean(allFeatures.standardAlertsAndReminders),
        documentReviewsPerMonth: Number(allFeatures.documentReviewsPerMonth) || 0,
        reportsGeneratedPerMonth: Number(allFeatures.reportsGeneratedPerMonth) || 0,
        messagesPerMonth: Number(allFeatures.messagesPerMonth) || 0,
        notificationsSend: Number(allFeatures.notificationsSend) || 0,
        reportCreate: Number(allFeatures.reportCreate) || 0,
    };
}

function getDefaultFeatures(): PlanFeatures {
    return {
        editSupplier: false,
        fullAssessments: false,
        complianceDashboard: false,
        overallCompliance: false,
        emailSupport: false,
        prioritySupport: false,
        standardAlertsAndReminders: false,
        documentReviewsPerMonth: 0,
        reportsGeneratedPerMonth: 0,
        messagesPerMonth: 0,
        notificationsSend: 0,
        reportCreate: 0,
    };
}