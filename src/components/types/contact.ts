export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  data?: any;
}