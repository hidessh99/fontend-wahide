"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, Tenant } from "../types/auth.types";
import { authApi } from "../api/auth.api";
import { userApi } from "../api/user.api";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { setCookie, clearAllAuthStorage } from "@/lib/storage/cookies";

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
  updateProfileName: (name: string) => Promise<void>;
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
          const res = await authApi.login(credentials);

          const user: User = {
            id: res.tenant_id || "",
            name: res.name || "",
            email: res.email || "",
            role: res.role ? res.role.toUpperCase() : "SELLER",
            tenantId: res.tenant_id || "",
            createdAt: new Date().toISOString(),
          };

          const tenant: Tenant = {
            id: res.tenant_id || "",
            name: `${res.name}'s Workspace`,
            planId: "free",
            planName: "Free Trial",
            maxDevices: 1,
            maxAgents: 1,
            monthlyQuota: 1000,
            usedQuota: 0,
            activeDevicesCount: 0,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          };

          // Synchronize cookies for 0ms Edge Middleware route protection
          setCookie("wahide_session_token", res.token, 2592000);
          setCookie("wahide_user_role", user.role, 2592000);

          set({
            user,
            tenant,
            token: res.token,
            tenantId: res.tenant_id || null,
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
          await authApi.register(payload);
          set({ isLoading: false });
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
          // Clear all cookies & local storage
          clearAllAuthStorage();

          set({
            user: null,
            tenant: null,
            token: null,
            tenantId: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
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

      updateProfileName: async (name: string) => {
        const currentUser = get().user;
        if (!currentUser || !currentUser.id) {
          throw new Error("Sesi pengguna tidak ditemukan. Silakan login ulang.");
        }

        set({ isLoading: true, error: null });
        try {
          await userApi.updateProfile(currentUser.id, { name });
          set((state) => ({
            isLoading: false,
            user: state.user ? { ...state.user, name } : null,
            tenant: state.tenant ? { ...state.tenant, name: `${name}'s Workspace` } : null,
          }));
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Gagal memperbarui nama profil.";
          set({ isLoading: false, error: errorMessage });
          throw err;
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
