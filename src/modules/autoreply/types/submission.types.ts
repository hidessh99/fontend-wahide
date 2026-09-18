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
