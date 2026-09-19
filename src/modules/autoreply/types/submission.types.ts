// ==============================================================================
// Wahide Frontend - Flow Submission Types
// Captured leads and form responses
// ==============================================================================

export interface FlowSubmission {
  id: string;
  tenant_id: string;
  flow_id: string;
  flow_name?: string;
  device_id: string;
  channel_type: string;
  sender_phone: string;
  sender_name?: string;
  answers: Record<string, unknown>;
  status: string;
  created_at: string;
}

export interface ListSubmissionsQuery {
  flow_id?: string;
  device_id?: string;
  channel_type?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Linear Form Builder Types for Simple WhatsApp Submission Bots
export type FormQuestionType = "text" | "number" | "phone" | "email";

export interface FormQuestionItem {
  id: string;
  question: string;
  variableName: string;
  type: FormQuestionType;
}

export interface LinearSubmissionFormInput {
  id?: string;
  name: string;
  description?: string;
  trigger_keywords: string[];
  welcome_message?: string;
  questions: FormQuestionItem[];
  completion_message: string;
  is_active?: boolean;
}
