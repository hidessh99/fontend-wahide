"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { isAdmin } from "../types/auth.types";
import { userApi } from "../api/user.api";
import { adminApi } from "@/services/admin/api/admin.api";
import { UserDashboardStats, AdminDashboardStats } from "../types/dashboard.types";

export function useDashboardStats() {
  const { user, isAuthenticated } = useAuth();
  const isSuperAdmin = isAdmin(user?.role);

  const [userStats, setUserStats] = useState<UserDashboardStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
        const data = await adminApi.getAdminDashboardStats();
        setAdminStats(data);
      } else {
        const data = await userApi.getDashboardStats();
        setUserStats(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat statistik dasbor";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isSuperAdmin]);

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      return;
    }

    const init = async () => {
      try {
        if (isSuperAdmin) {
          const data = await adminApi.getAdminDashboardStats();
          if (isMounted) {
            setAdminStats(data);
            setIsLoading(false);
          }
        } else {
          const data = await userApi.getDashboardStats();
          if (isMounted) {
            setUserStats(data);
            setIsLoading(false);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Gagal memuat statistik dasbor";
          setError(msg);
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
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
