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
  role: "USER" | "SUPER_ADMIN";
  planName: string;
  quotaRemaining: number;
  depositBalance: number;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface AdjustBalanceInput {
  userId: string;
  addQuota: number;
  addBalance: number;
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
