/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from "react";

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    icon?: string;       
    component: ComponentType;
  }[];
}

export type TRole =  "VENDOR"  | "ADMIN" | "SUPPLIER";
// src/components/pages/dashboard/supplier/notifications/types.ts
export type AlertType = "error" | "warning" | "info" | "success";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  date: Date;
  resolved?: boolean;
}


export interface ISendOtp {
  [x: string]: any;
  email: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}


// src/types/assessment.ts
export type ReviewAssessmentPayload = {
  status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION' | 'UNDER_REVIEW';
  reviewComments?: string;
  reviewerReport?: string;
};

export type ReviewAssessmentRequest = {
  body: ReviewAssessmentPayload;
};