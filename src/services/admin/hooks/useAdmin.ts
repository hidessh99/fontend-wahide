"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AdminMetrics, UserItem, AdjustBalanceInput } from "../types/admin.types";
import { adminApi } from "../api/admin.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useAdmin() {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");

  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metData, usrData] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getUsers(),
      ]);
      setMetrics(metData);
      setUsers(usrData);
    } catch {
      // Fallbacks in API
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [metData, usrData] = await Promise.all([
          adminApi.getMetrics(),
          adminApi.getUsers(),
        ]);
        if (isMounted) {
          setMetrics(metData);
          setUsers(usrData);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const adjustBalance = async (payload: AdjustBalanceInput) => {
    try {
      await adminApi.adjustUserBalance(payload);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === payload.userId
            ? {
                ...u,
                quotaRemaining: u.quotaRemaining + payload.addQuota,
                depositBalance: u.depositBalance + payload.addBalance,
              }
            : u
        )
      );
      toast.success(t("admin.toastAdjustSuccess"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyesuaikan saldo";
      toast.error(msg);
      throw err;
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        searchQuery === "" ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlan =
        planFilter === "ALL" || u.planName === planFilter;

      return matchesSearch && matchesPlan;
    });
  }, [users, searchQuery, planFilter]);

  return {
    metrics,
    users,
    filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    planFilter,
    setPlanFilter,
    fetchAdminData,
    adjustBalance,
  };
}
