"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AdminSubscriptionItem } from "@/modules/admin/types/admin.types";
import { adminApi } from "@/modules/admin/api/admin.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useAdminSubscriptions() {
  const { t } = useI18n();
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAdminSubscriptions({
        page,
        pageSize,
        search: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        planId: planFilter !== "ALL" ? planFilter : undefined,
      });

      setSubscriptions(res.subscriptions);
      setTotal(res.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.subscriptions.loadFailedToast");
      toast.error(msg);
      setSubscriptions([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, planFilter, t]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getAdminSubscriptions(
          {
            page,
            pageSize,
            search: searchQuery || undefined,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            planId: planFilter !== "ALL" ? planFilter : undefined,
          },
          controller.signal
        );
        if (!controller.signal.aborted) {
          setSubscriptions(res.subscriptions);
          setTotal(res.total);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setSubscriptions([]);
          setTotal(0);
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      controller.abort();
    };
  }, [page, pageSize, searchQuery, statusFilter, planFilter]);

  const expireSubscription = async (id: string) => {
    try {
      await adminApi.expireAdminSubscription(id);
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "EXPIRED", expiredAt: new Date().toISOString() } : s
        )
      );
      toast.success(t("admin.subscriptions.expireSuccessToast"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.subscriptions.expireFailedToast");
      toast.error(msg);
      throw err;
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const executeSearch = (q: string) => {
    setSearchQuery(q.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  const changeStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const changePlanFilter = (plan: string) => {
    setPlanFilter(plan);
    setPage(1);
  };

  const setPageNumber = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const metrics = useMemo(() => {
    const activeCount = subscriptions.filter((s) => s.status === "ACTIVE").length;
    const expiredCount = subscriptions.filter((s) => s.status === "EXPIRED").length;
    const trialCount = subscriptions.filter((s) => s.status === "TRIAL").length;
    const suspendedCount = subscriptions.filter((s) => s.status === "SUSPENDED").length;

    return {
      totalCount: total,
      activeCount,
      expiredCount,
      trialCount,
      suspendedCount,
    };
  }, [subscriptions, total]);

  return {
    subscriptions,
    isLoading,
    searchQuery,
    statusFilter,
    planFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    fetchSubscriptions,
    expireSubscription,
    executeSearch,
    clearSearch,
    setStatusFilter: changeStatusFilter,
    setPlanFilter: changePlanFilter,
    setPage: setPageNumber,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
  };
}
