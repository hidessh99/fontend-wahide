"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { UserActivityItem } from "../types/admin.types";
import { adminApi } from "../api/admin.api";
import { toast } from "sonner";

export function useUserActivities() {
  const [activities, setActivities] = useState<UserActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSearch, setActiveSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchActivities = useCallback(
    async (targetPage?: number, overrideSearch?: string) => {
      setIsLoading(true);
      try {
        const p = targetPage !== undefined ? targetPage : page;
        const search = overrideSearch !== undefined ? overrideSearch.trim() : activeSearch.trim();

        const res = await adminApi.getUserActivities({
          page: p,
          pageSize,
          search,
        });

        setActivities(res.activities);
        setTotal(res.total);
        setPage(res.page);

        if (overrideSearch !== undefined) {
          setActiveSearch(overrideSearch.trim());
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal memuat log aktivitas pengguna";
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [activeSearch, page, pageSize]
  );

  const executeSearch = async (query: string) => {
    await fetchActivities(1, query);
  };

  const clearSearch = async () => {
    await fetchActivities(1, "");
  };

  const nextPage = async () => {
    if (page < totalPages) {
      await fetchActivities(page + 1);
    }
  };

  const prevPage = async () => {
    if (page > 1) {
      await fetchActivities(page - 1);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const init = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getUserActivities({ page: 1, pageSize: 15 }, controller.signal);
        if (!controller.signal.aborted) {
          setActivities(res.activities);
          setTotal(res.total);
          setPage(res.page);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    init();
    return () => {
      controller.abort();
    };
  }, []);

  const deleteActivity = async (id: string) => {
    try {
      await adminApi.deleteUserActivity(id);
      toast.success("Rekaman aktivitas berhasil dihapus");
      await fetchActivities(page);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus rekaman aktivitas";
      toast.error(msg);
      throw err;
    }
  };

  const filteredActivities = useMemo(() => {
    if (typeFilter === "ALL") return activities;
    return activities.filter((item) => {
      const actType = (item.activityType || item.type || "").toUpperCase();
      if (typeFilter === "FINANCE") {
        return (
          actType.includes("TOPUP") ||
          actType.includes("PAYMENT") ||
          actType.includes("WITHDRAWAL") ||
          actType.includes("SUBSCRIPTION") ||
          actType.includes("INCOME") ||
          actType.includes("BALANCE")
        );
      }
      if (typeFilter === "AUTH") {
        return (
          actType.includes("LOGIN") ||
          actType.includes("LOGOUT") ||
          actType.includes("REGISTER") ||
          actType.includes("SESSION")
        );
      }
      if (typeFilter === "SECURITY") {
        return (
          actType.includes("PASSWORD") ||
          actType.includes("VERIFY") ||
          actType.includes("TOKEN") ||
          actType.includes("APIKEY") ||
          actType.includes("SECURITY")
        );
      }
      if (typeFilter === "WHATSAPP") {
        return (
          actType.includes("DEVICE") ||
          actType.includes("CAMPAIGN") ||
          actType.includes("WHATSAPP") ||
          actType.includes("MESSAGE")
        );
      }
      if (typeFilter === "PROFILE") {
        return (
          actType.includes("PROFILE") ||
          actType.includes("USER") ||
          actType.includes("UPDATE") ||
          actType.includes("ADDRESS")
        );
      }
      return actType === typeFilter;
    });
  }, [activities, typeFilter]);

  return {
    activities,
    filteredActivities,
    isLoading,
    activeSearch,
    typeFilter,
    page,
    pageSize,
    total,
    totalPages,
    executeSearch,
    clearSearch,
    setTypeFilter,
    nextPage,
    prevPage,
    deleteActivity,
    refresh: () => fetchActivities(page),
  };
}
