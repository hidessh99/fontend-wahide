import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { User, DashboardStats, BackendUserPayload } from "../types/auth.types";
import { ChangePasswordInput } from "../schemas/auth.schema";

const IAM_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export const userApi = {
  getProfile: async (): Promise<User> => {
    const res = await httpClient.get<BackendUserPayload>(`${IAM_BASE}/users/profile`);
    const p = res.payload || (res as unknown as BackendUserPayload);
    return {
      id: p.id || "",
      name: p.name || "",
      email: p.email || "",
      role: (p.role_name?.toUpperCase() || "SELLER"),
      phone: p.phone_number,
      balance: p.balance,
      incomePending: p.income,
      isVerified: p.is_active,
      createdAt: p.created_at || new Date().toISOString(),
    };
  },

  changePassword: async (payload: ChangePasswordInput): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.put(`${IAM_BASE}/users/change-password`, payload);
    return { success: res.success, message: res.message };
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await httpClient.get<DashboardStats>(`${IAM_BASE}/users/dashboard/stats`);
    return (
      res.payload || {
        totalMessagesSent: 0,
        totalDevicesConnected: 0,
        quotaRemaining: 1000,
        activeCampaignsCount: 0,
        totalContacts: 0,
      }
    );
  },
};
