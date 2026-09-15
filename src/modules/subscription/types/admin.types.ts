export interface AdminPlanItem {
  id: string;
  name: string;
  price: number;
  monthly_message_limit: number;
  max_devices: number;
  max_agents: number;
  has_watermark: boolean;
  watermark_text?: string;
  allow_attachment: boolean;
  allow_campaign: boolean;
  allow_autoreply: boolean;
  allow_schedule: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePlanInput {
  name: string;
  price: number;
  monthly_message_limit: number;
  max_devices: number;
  max_agents: number;
  has_watermark: boolean;
  watermark_text?: string;
  allow_attachment: boolean;
  allow_campaign: boolean;
  allow_autoreply: boolean;
  allow_schedule: boolean;
}

export interface UpdatePlanInput {
  name?: string;
  price?: number;
  monthly_message_limit?: number;
  max_devices?: number;
  max_agents?: number;
  has_watermark?: boolean;
  watermark_text?: string;
  allow_attachment?: boolean;
  allow_campaign?: boolean;
  allow_autoreply?: boolean;
  allow_schedule?: boolean;
}

export type SubscriptionStatus =
  "ACTIVE" | "EXPIRED" | "TRIAL" | "SUSPENDED" | string;

export interface AdminSubscriptionItem {
  id: string;
  tenantId: string;
  planId: string;
  currentMonthUsage: number;
  startedAt: string;
  expiredAt: string;
  status: SubscriptionStatus;
  plan?: AdminPlanItem;
  tenant?: {
    id: string;
    name: string;
    status?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminSubscriptionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  planId?: string;
  tenantId?: string;
}

export interface AdminSubscriptionListResponse {
  subscriptions: AdminSubscriptionItem[];
  total: number;
  page: number;
  pageSize: number;
}
