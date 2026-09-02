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
