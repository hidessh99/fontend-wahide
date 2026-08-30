import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  AuthResponse,
  ApiKeyInfo,
} from "../types/auth.types";
import {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schemas/auth.schema";

const IAM_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export const authApi = {
  login: async (payload: LoginInput): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>(`${IAM_BASE}/auth/login`, payload);
  },

  register: async (payload: RegisterInput): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>(`${IAM_BASE}/auth/register`, payload);
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    return httpClient.post(`${IAM_BASE}/auth/logout`);
  },

  forgotPassword: async (payload: ForgotPasswordInput): Promise<{ message: string }> => {
    return httpClient.post(`${IAM_BASE}/auth/forgot-password`, payload);
  },

  resetPassword: async (payload: ResetPasswordInput): Promise<{ message: string }> => {
    return httpClient.post(`${IAM_BASE}/auth/reset-password`, payload);
  },

  getApiKey: async (): Promise<{ token: string }> => {
    return httpClient.get<{ token: string }>(`${IAM_BASE}/auth/token`);
  },

  generateApiKey: async (): Promise<ApiKeyInfo> => {
    return httpClient.post<ApiKeyInfo>(`${IAM_BASE}/auth/token`);
  },

  revokeApiKey: async (): Promise<{ success: boolean; message: string }> => {
    return httpClient.delete(`${IAM_BASE}/auth/token`);
  },
};
