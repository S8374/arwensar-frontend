/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/dashboard.types.ts
export interface NIS2Compliance {
  currentScore: number;
  previousScore: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  changePercentage: number;
  improvementToday: number;
  improvementWeek: number;
  improvementMonth: number;
  scoreHistory: Array<{
    date: string;
    score: number;
  }>;
  breakdown: {
    assessmentCompleteness: {
      score: number;
      weight: number;
      description: string;
    };
    riskProfile: {
      score: number;
      weight: number;
      description: string;
    };
    documentCompliance: {
      score: number;
      weight: number;
      description: string;
    };
    timeliness: {
      score: number;
      weight: number;
      description: string;
    };
  };
}

export interface RiskDistribution {
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  criticalRisk: number;
  totalSuppliers: number;
  lowRiskPercentage: number;
  mediumRiskPercentage: number;
  highRiskPercentage: number;
  criticalRiskPercentage: number;
}

export interface SupplierProblems {
  total: number;
  pending: number;
  resolved: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  recentProblems: Array<any>;
}

export interface DocumentCompliance {
  totalDocumentsRequired: number;
  documentsSubmitted: number;
  missingDocuments: number;
  complianceRate: number;
  recentSubmissions: Array<{
    supplierName: string;
    submittedCount: number;
    requiredCount: number;
    rate: number;
  }>;
}

export interface TotalSuppliers {
  currentTotal: number;
  thisMonthAdded: number;
  todayAdded: number;
  activeCount: number;
  inactiveCount: number;
  growthRate: number;
  suppliersByMonth: Array<{
    month: string;
    count: number;
  }>;
}

export interface AverageScore {
  currentAvg: number;
  previousAvg: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  highScoreSuppliers: number;
  lowScoreSuppliers: number;
  scoreDistribution: any;
}

export interface ExpiringContracts {
  totalExpiring: number;
  totalExpired: number;
  expiringThisWeek: number;
  expiringThisMonth: number;
  contractsBySupplier: Array<{
    supplierName: string;
    contractEndDate: string;
    daysLeft: number;
  }>;
  monthlyExpiry: Array<{
    month: string;
    count: number;
  }>;
}

export interface ComplianceOverview {
  totalIssues: number;
  highPriorityIssues: number;
  mediumPriorityIssues: number;
  lowPriorityIssues: number;
  resolvedIssues: number;
  unresolvedIssues: number;
  issueTrend: 'UP' | 'DOWN' | 'STABLE';
  recentIssues: Array<any>;
}

export interface ComplianceGauge {
  nonProblemSuppliers: number;
  problemSuppliers: number;
  totalSuppliers: number;
  complianceScore: number;
  riskDistribution: any;
}

export interface RecentAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  read: boolean;
  supplierName: string;
}

export interface QuickStats {
  totalAssessments: number;
  totalSubmissions: number;
  averageResponseTime: number;
  pendingReviews: number;
  completionRate: number;
  averageDocumentScore: number;
  totalSuppliers: number;
  documentComplianceRate: number;
}

export interface Timeline {
  today: {
    newAssessments: number;
    newProblems: number;
    resolvedProblems: number;
    scoreChange: number;
  };
  thisWeek: {
    newSuppliers: number;
    completedAssessments: number;
    riskChanges: number;
  };
  thisMonth: {
    overallImprovement: number;
    problemsResolved: number;
    contractsExpiring: number;
  };
}

export interface RiskTrends {
  highRiskSuppliers: {
    current: number;
    previous: number;
    change: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  riskChanges: {
    improved: number;
    worsened: number;
    unchanged: number;
  };
}

export interface AssessmentProgress {
  pending: number;
  completed: number;
  inProgress: number;
  averageScore: number;
  completionRate: number;
}

export interface ContractManagement {
  expiringContracts: number;
  expiredContracts: number;
  renewalsDue: number;
  avgDaysToExpiry: number;
}

export interface DashboardStats {
  nis2Compliance: NIS2Compliance;
  riskDistribution: RiskDistribution;
  activeProblems: SupplierProblems;
  documentCompliance: DocumentCompliance;
  totalSuppliers: TotalSuppliers;
  totalAvgScore: AverageScore;
  expiringContracts: ExpiringContracts;
  complianceOverview: ComplianceOverview;
  complianceGauge: ComplianceGauge;
  recentAlerts: RecentAlert[];
  quickStats: QuickStats;
  timeline: Timeline;
  riskTrends: RiskTrends;
  assessmentProgress: AssessmentProgress;
  contractManagement: ContractManagement;
  recommendations: string[];
  supplierProblems: SupplierProblems;
}