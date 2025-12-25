// src/redux/features/assessment/assessment.types.ts
export interface IAssessmentQuestion {
  id: string;
  questionId: number;
  question: string;
  description?: string;
  order: number;
  isDocument: boolean;
  isInputField: boolean;
  answerType: string;
  required: boolean;
  weight?: number;
  maxScore: number;
  helpText?: string;
  bivCategory?: string;
  evidenceRequired: boolean;
  documentType?: string;
}

export interface IAssessmentCategory {
  id: string;
  categoryId: string;
  title: string;
  description?: string;
  order: number;
  weight?: number;
  maxScore: number;
  questions: IAssessmentQuestion[];
}

export interface IAssessment {
  id: string;
  examId: string;
  title: string;
  description?: string;
  isActive: boolean;
  isTemplate: boolean;
  stage: string;
  totalPoints: number;
  passingScore?: number;
  timeLimit?: number;
  categories: IAssessmentCategory[];
  userSubmission?: IAssessmentSubmission;
  totalQuestions: number;
}

export interface IAssessmentAnswer {
  id: string;
  answer?: string;
  evidence?: string;
  comments?: string;
  score?: number;
  maxScore: number;
  evidenceStatus: string;
  evidenceRejectionReason?: string;
  questionId: string;
  submissionId: string;
}

export interface IAssessmentSubmission {
  id: string;
  assessmentId: string;
  userId: string;
  supplierId: string;
  vendorId: string;
  status: string;
  stage: string;
  totalQuestions: number;
  answeredQuestions: number;
  progress: number;
  score?: number;
  riskScore?: number;
  riskLevel?: string;
  businessScore?: number;
  integrityScore?: number;
  availabilityScore?: number;
  bivScore?: number;
  startedAt?: string;
  submittedAt?: string;
  reviewedAt?: string;
  answers: IAssessmentAnswer[];
  assessment: {
    id: string;
    title: string;
    description?: string;
    stage: string;
  };
}