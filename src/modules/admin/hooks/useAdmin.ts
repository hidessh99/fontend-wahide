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
  const [activeSearch, setActiveSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

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
        activeSearch === "" ||
        u.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesPlan =
        planFilter === "ALL" || u.planName === planFilter;

      return matchesSearch && matchesPlan;
    });
  }, [users, activeSearch, planFilter]);

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const executeSearch = (query: string) => {
    setActiveSearch(query.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setActiveSearch("");
    setPage(1);
  };

  const changePlanFilter = (plan: string) => {
    setPlanFilter(plan);
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return {
    metrics,
    users,
    filteredUsers,
    paginatedUsers,
    isLoading,
    activeSearch,
    planFilter,
    page,
    pageSize,
    total,
    totalPages,
    executeSearch,
    clearSearch,
    setPlanFilter: changePlanFilter,
    nextPage,
    prevPage,
    fetchAdminData,
    adjustBalance,
  };
}
