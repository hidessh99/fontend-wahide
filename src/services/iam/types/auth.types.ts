export type UserRole = "SUPER_ADMIN" | "SELLER" | "AGENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  balance?: number;
  incomePending?: number;
  tenantId?: string;
  isVerified?: boolean;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  planId: string;
  planName: string;
  maxDevices: number;
  maxAgents: number;
  monthlyQuota: number;
  usedQuota: number;
  activeDevicesCount: number;
  expiresAt: string;
  webhookUrl?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  tenant?: Tenant;
  expiresIn?: number;
}

export interface ApiKeyInfo {
  token: string;
  createdAt: string;
  expiresAt?: string;
}

export interface DashboardStats {
  totalMessagesSent: number;
  totalDevicesConnected: number;
  quotaRemaining: number;
  activeCampaignsCount: number;
  totalContacts: number;
  monthlyCost?: number;
}
