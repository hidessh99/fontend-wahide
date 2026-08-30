import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { User, DashboardStats } from "../types/auth.types";
import { ChangePasswordInput } from "../schemas/auth.schema";

const IAM_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export const userApi = {
  getProfile: async (): Promise<User> => {
    return httpClient.get<User>(`${IAM_BASE}/users/profile`);
  },

  changePassword: async (payload: ChangePasswordInput): Promise<{ success: boolean; message: string }> => {
    return httpClient.put(`${IAM_BASE}/users/change-password`, payload);
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    return httpClient.get<DashboardStats>(`${IAM_BASE}/users/dashboard/stats`);
  },
};
