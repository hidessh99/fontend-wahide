export interface AdminMetrics {
  mrr: number;
  totalUsers: number;
  activeDevices: number;
  redisQueueMessages: number;
  clusterHealth: "HEALTHY" | "DEGRADED" | "CRITICAL";
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  role: string;
  roleName?: string;
  planName?: string;
  quotaRemaining?: number;
  depositBalance: number;
  balance?: number;
  status: "ACTIVE" | "SUSPENDED";
  isActive?: boolean;
  createdAt: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  password?: string;
  isActive?: boolean;
  role?: string;
}

export interface AdjustBalanceInput {
  userId: string;
  type: "ADD" | "REDUCE";
  amount: number;
  idempotencyKey?: string;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UserListResponse {
  users: UserItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserActivityUser {
  id: string;
  name: string;
  email: string;
  roleName?: string;
  phoneNumber?: string;
  isActive: boolean;
}

export interface UserActivityItem {
  id: string;
  userId: string;
  tenantId?: string;
  activityType: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  user?: UserActivityUser;
}

export interface GetUserActivitiesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  userId?: string;
  tenantId?: string;
}

export interface UserActivityListResponse {
  activities: UserActivityItem[];
  total: number;
  page: number;
  pageSize: number;
}

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

export type BillingStatus = "PENDING" | "PROCESSING" | "PAID" | "EXPIRED" | "CANCELLED";

export interface AdminBillingUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface AdminBillingItem {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: BillingStatus;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: AdminBillingUser;
}

export interface GetAdminBillingsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  userId?: string;
}

export interface AdminBillingListResponse {
  billings: AdminBillingItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateBillingStatusInput {
  status: "EXPIRED" | "CANCELLED";
  amount?: number;
  method?: string;
}

export type QueueStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface AdminQueueItem {
  id: string;
  userId: string;
  taskType: string;
  payload: Record<string, unknown>;
  priority: number;
  status: QueueStatus;
  scheduledAt?: string;
  startedAt?: string;
  finishedAt?: string;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
  targetEmail?: string;
  targetName?: string;
}

export interface GetAdminQueueParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export interface AdminQueueListResponse {
  queues: AdminQueueItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BroadcastToAllInput {
  subject: string;
  message: string;
}

export interface BroadcastToUsersInput {
  userIds: string[];
  subject: string;
  message: string;
}

export interface CreateEmailQueueInput {
  email: string;
  name?: string;
  subject: string;
  message: string;
  taskType?: string;
  priority?: number;
}
