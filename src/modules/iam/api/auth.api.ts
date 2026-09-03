import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { BackendLoginPayload, ApiKeyInfo } from "../types/auth.types";
import {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schemas/auth.schema";

const IAM_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export const authApi = {
  login: async (payload: LoginInput): Promise<BackendLoginPayload> => {
    const res = await httpClient.post<BackendLoginPayload>(`${IAM_BASE}/auth/login`, payload);
    return res.payload || (res as unknown as BackendLoginPayload);
  },

  register: async (payload: RegisterInput): Promise<{ message: string }> => {
    const res = await httpClient.post<{ message: string }>(`${IAM_BASE}/auth/register`, {
      name: payload.name,
      email: payload.email,
      phone_number: payload.phone,
      password: payload.password,
    });
    return { message: res.message || "Registrasi berhasil." };
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${IAM_BASE}/auth/logout`);
    return { success: res.success, message: res.message };
  },

  forgotPassword: async (payload: ForgotPasswordInput): Promise<{ message: string }> => {
    const res = await httpClient.post(`${IAM_BASE}/auth/forgot-password`, payload);
    return { message: res.message || "Tautan pemulihan sandi telah dikirim." };
  },

  resetPassword: async (payload: ResetPasswordInput): Promise<{ message: string }> => {
    const res = await httpClient.post(`${IAM_BASE}/auth/reset-password`, {
      token: payload.token,
      password: payload.password,
    });
    return { message: res.message || "Password berhasil diatur ulang." };
  },

  getApiKey: async (): Promise<{ token: string }> => {
    const res = await httpClient.get<{ token: string }>(`${IAM_BASE}/auth/token`);
    return res.payload || { token: "" };
  },

  generateApiKey: async (): Promise<ApiKeyInfo> => {
    const res = await httpClient.post<ApiKeyInfo>(`${IAM_BASE}/auth/token`);
    return res.payload || { token: "" };
  },

  revokeApiKey: async (): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${IAM_BASE}/auth/token`);
    return { success: res.success, message: res.message };
  },
};
