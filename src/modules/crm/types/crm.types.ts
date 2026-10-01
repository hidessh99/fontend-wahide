// ==============================================================================
// Wahide Pipeline CRM (Kanban Deals & Stages) Types
// ==============================================================================

export type CRMDealStatus = "OPEN" | "WON" | "LOST";

export interface CRMDeal {
  id: string;
  tenant_id: string;
  pipeline_id: string;
  stage_id: string;
  contact_id: string;
  contact_name?: string;
  contact_phone?: string;
  channel_origin?: string;
  assigned_user_id?: string | null;
  title: string;
  value_amount: number;
  status: CRMDealStatus;
  expected_close_date?: string | null;
  closed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CRMStage {
  id: string;
  pipeline_id: string;
  tenant_id: string;
  name: string;
  order_index: number;
  color_hex: string;
  is_won: boolean;
  is_lost: boolean;
  deals: CRMDeal[];
  total_deals: number;
  total_value: number;
}

export interface CRMPipeline {
  id: string;
  tenant_id: string;
  name: string;
  is_default: boolean;
  stages: CRMStage[];
  total_pipeline_value: number;
  total_pipeline_deals: number;
  created_at: string;
}

export interface CreateDealInput {
  pipeline_id: string;
  stage_id: string;
  contact_id: string;
  assigned_user_id?: string;
  title: string;
  value_amount: number;
  expected_close_date?: string;
}

export interface UpdateDealInput {
  title?: string;
  value_amount?: number;
  assigned_user_id?: string;
  expected_close_date?: string;
}

export interface MoveDealStageInput {
  target_stage_id: string;
}
