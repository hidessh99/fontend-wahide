"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { isAdmin } from "../types/auth.types";
import { userApi } from "../api/user.api";
import { iamAdminApi } from "../api/admin.api";
import {
  UserDashboardStats,
  AdminDashboardStats,
} from "../types/dashboard.types";
import { ApiError } from "@/lib/api/http-client";

export function useDashboardStats() {
  const userRole = useAuth((s) => s.user?.role);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isSuperAdmin = isAdmin(userRole);

  const [userStats, setUserStats] = useState<UserDashboardStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminDashboardStats | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(isAuthenticated);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isSuperAdmin) {
        const data = await iamAdminApi.getAdminDashboardStats();
        setAdminStats(data);
      } else {
        const data = await userApi.getDashboardStats();
        setUserStats(data);
        if (data) {
          const currentTenant = useAuth.getState().tenant;
          if (currentTenant) {
            // Guard against unnecessary state updates to prevent render cascades
            const hasChanged =
              currentTenant.planName !==
                (data.plan_name || currentTenant.planName) ||
              currentTenant.maxDevices !==
                (data.device_limit || currentTenant.maxDevices) ||
              currentTenant.monthlyQuota !== data.monthly_message_limit ||
              currentTenant.usedQuota !== data.total_messages_sent ||
              currentTenant.activeDevicesCount !== data.connected_devices;

            if (hasChanged) {
              useAuth.getState().setTenant({
                ...currentTenant,
                planName: data.plan_name || currentTenant.planName,
                maxDevices: data.device_limit || currentTenant.maxDevices,
                monthlyQuota: data.monthly_message_limit,
                usedQuota: data.total_messages_sent,
                activeDevicesCount: data.connected_devices,
              });
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (
        err instanceof ApiError &&
        (err.statusCode === 401 ||
          err.code === "USER_NOT_FOUND" ||
          err.code === "ACCOUNT_INACTIVE")
      ) {
        useAuth
          .getState()
          .logout()
          .catch(() => null);
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login?session_invalid=1";
        }
        return;
      }
      const msg =
        err instanceof Error ? err.message : "Gagal memuat statistik dasbor";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isSuperAdmin]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const controller = new AbortController();

    const loadInitialStats = async () => {
      try {
        if (isSuperAdmin) {
          const data = await iamAdminApi.getAdminDashboardStats();
          if (isMounted) setAdminStats(data);
        } else {
          const data = await userApi.getDashboardStats();
          if (isMounted) {
            setUserStats(data);
            if (data) {
              const currentTenant = useAuth.getState().tenant;
              if (currentTenant) {
                const hasChanged =
                  currentTenant.planName !==
                    (data.plan_name || currentTenant.planName) ||
                  currentTenant.maxDevices !==
                    (data.device_limit || currentTenant.maxDevices) ||
                  currentTenant.monthlyQuota !== data.monthly_message_limit ||
                  currentTenant.usedQuota !== data.total_messages_sent ||
                  currentTenant.activeDevicesCount !== data.connected_devices;

                if (hasChanged) {
                  useAuth.getState().setTenant({
                    ...currentTenant,
                    planName: data.plan_name || currentTenant.planName,
                    maxDevices: data.device_limit || currentTenant.maxDevices,
                    monthlyQuota: data.monthly_message_limit,
                    usedQuota: data.total_messages_sent,
                    activeDevicesCount: data.connected_devices,
                  });
                }
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (
          err instanceof ApiError &&
          (err.statusCode === 401 ||
            err.code === "USER_NOT_FOUND" ||
            err.code === "ACCOUNT_INACTIVE")
        ) {
          useAuth
            .getState()
            .logout()
            .catch(() => null);
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register"
          ) {
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = "/login?session_invalid=1";
          }
          return;
        }
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat statistik dasbor",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialStats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isAuthenticated, isSuperAdmin]);

  return {
    isSuperAdmin,
    userStats,
    adminStats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
