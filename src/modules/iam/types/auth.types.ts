// Canonical Backend Role Constants (matching G:\WEB2026\wahide\internal\modules\iam\domain\entity\role.go)
export type UserRole =
  | "admin"
  | "seller"
  | "user"
  | "reseller"
  | "SUPER_ADMIN"
  | "SELLER"
  | "AGENT"
  | "CS"
  | "SUPERVISOR"
  | "OWNER"
  | string;

export function isAdmin(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === "admin" || r === "super_admin" || r === "superadmin";
}

export function isSeller(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === "seller";
}

export function isCS(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === "cs" || r === "agent" || r === "staff";
}

export function isTenantOwner(role?: string): boolean {
  if (!role) return true; // Default to owner if role unspecified
  const r = role.toLowerCase();
  if (isCS(r) || isAdmin(r) || isSeller(r)) return false;
  return true; // "user", "owner", "tenant_admin", etc.
}

export function canAccessBilling(role?: string): boolean {
  return !isCS(role);
}

export function canManageTeam(role?: string): boolean {
  return !isCS(role);
}

export function canPairQRDevice(role?: string): boolean {
  return !isCS(role);
}

export function canAccessCampaigns(role?: string): boolean {
  return !isCS(role);
}

export function isUserAgent(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === "user" || r === "staff" || r === "agent";
}

export interface BackendLoginPayload {
  role: string;
  tenant_id: string;
  name: string;
  email: string;
  token: string;
  token_type?: string;
}

export interface BackendUserPayload {
  id: string;
  name: string;
  email: string;
  role_name?: string;
  phone_number?: string;
  token?: string;
  balance?: number;
  income?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  token?: string;
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
  createdAt?: string;
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

export interface ActiveSession {
  token_id: string;
  user_id: string;
  email: string;
  role: string;
  tenant_id: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  last_active?: string;
  is_current?: boolean;
}
