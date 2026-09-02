import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { User, BackendUserPayload } from "../types/auth.types";
import { UserDashboardStats } from "../types/dashboard.types";
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

  updateProfile: async (
    userId: string,
    payload: { name: string }
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.put<{ success: boolean; message: string }>(
      `${IAM_BASE}/users/${userId}`,
      payload
    );
    return {
      success: res.success,
      message: res.message || "Profil berhasil diperbarui.",
    };
  },

  changePassword: async (
    payload: ChangePasswordInput | { oldPassword: string; newPassword: string; old_password?: string; new_password?: string }
  ): Promise<{ success: boolean; message: string }> => {
    const old_password = "old_password" in payload && payload.old_password ? payload.old_password : "oldPassword" in payload ? payload.oldPassword : "";
    const new_password = "new_password" in payload && payload.new_password ? payload.new_password : "newPassword" in payload ? payload.newPassword : "";

    const res = await httpClient.put<{ success: boolean; message: string }>(
      `${IAM_BASE}/users/change-password`,
      {
        old_password,
        new_password,
      }
    );
    return {
      success: res.success,
      message: res.message || "Kata sandi berhasil diperbarui.",
    };
  },

  getDashboardStats: async (): Promise<UserDashboardStats> => {
    const res = await httpClient.get<UserDashboardStats>(`${IAM_BASE}/users/dashboard/stats`);
    return (
      res.payload || {
        balance: 0,
        income: 0,
        total_devices: 0,
        connected_devices: 0,
        total_contacts: 0,
        total_campaigns: 0,
        total_messages_sent: 0,
        plan_name: "FREE",
        plan_status: "ACTIVE",
        device_limit: 1,
        monthly_message_limit: 1200,
        open_tickets: 0,
        recent_activities: [],
        recent_invoices: [],
      }
    );
  },

  getActiveSessions: async (): Promise<import("../types/auth.types").ActiveSession[]> => {
    const res = await httpClient.get<{ sessions: import("../types/auth.types").ActiveSession[]; count: number }>(
      `${IAM_BASE}/users/sessions`
    );
    const payload = res.payload || (res as unknown as { sessions: import("../types/auth.types").ActiveSession[] });
    return payload?.sessions || [];
  },

  logoutAllSessions: async (): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post<{ success: boolean; message: string }>(
      `${IAM_BASE}/users/logout-all`
    );
    return {
      success: res.success,
      message: res.message || "Seluruh sesi perangkat lain berhasil dicabut.",
    };
  },

  revokeSession: async (tokenId: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete<{ success: boolean; message: string }>(
      `${IAM_BASE}/users/sessions/${tokenId}`
    );
    return {
      success: res.success,
      message: res.message || "Sesi berhasil dicabut.",
    };
  },
};

