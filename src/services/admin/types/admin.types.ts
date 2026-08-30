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
