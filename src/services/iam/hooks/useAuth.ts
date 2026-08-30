"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, Tenant, AuthResponse } from "../types/auth.types";
import { authApi } from "../api/auth.api";
import { userApi } from "../api/user.api";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginInput) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setTenant: (tenant: Tenant) => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      token: null,
      tenantId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginInput) => {
        set({ isLoading: true, error: null });
        try {
          const res: AuthResponse = await authApi.login(credentials);
          set({
            user: res.user,
            tenant: res.tenant || null,
            token: res.token,
            tenantId: res.tenant?.id || res.user.tenantId || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Email atau password yang Anda masukkan salah.";
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw err;
        }
      },

      register: async (payload: RegisterInput) => {
        set({ isLoading: true, error: null });
        try {
          const res: AuthResponse = await authApi.register(payload);
          set({
            user: res.user,
            tenant: res.tenant || null,
            token: res.token,
            tenantId: res.tenant?.id || res.user.tenantId || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Gagal melakukan registrasi akun.";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw err;
        }
      },

      logout: async () => {
        try {
          if (get().token) {
            await authApi.logout().catch(() => null);
          }
        } finally {
          set({
            user: null,
            tenant: null,
            token: null,
            tenantId: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          if (typeof window !== "undefined") {
            localStorage.removeItem("wahide_auth_storage");
          }
        }
      },

      fetchProfile: async () => {
        if (!get().token) return;
        try {
          const user = await userApi.getProfile();
          set({ user, isAuthenticated: true });
        } catch {
          // Jika token invalid/expired, lakukan logout
          get().logout();
        }
      },

      setTenant: (tenant: Tenant) => {
        set({ tenant, tenantId: tenant.id });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "wahide_auth_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        token: state.token,
        tenantId: state.tenantId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
