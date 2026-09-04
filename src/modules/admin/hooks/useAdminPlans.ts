"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AdminPlanItem, CreatePlanInput, UpdatePlanInput } from "../types/admin.types";
import { adminApi } from "../api/admin.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useAdminPlans() {
  const { t } = useI18n();
  const [plans, setPlans] = useState<AdminPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getAdminPlans();
      setPlans(data);
    } catch {
      // Fallbacks in API
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const init = async () => {
      try {
        const data = await adminApi.getAdminPlans(controller.signal);
        if (!controller.signal.aborted) {
          setPlans(data);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    init();
    return () => {
      controller.abort();
    };
  }, []);

  const createPlan = async (input: CreatePlanInput) => {
    try {
      const newPlan = await adminApi.createAdminPlan(input);
      setPlans((prev) => [newPlan, ...prev]);
      toast.success(t("admin.plans.toastCreateSuccess", { name: newPlan.name }));
      return newPlan;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.plans.toastCreateFailed");
      toast.error(msg);
      throw err;
    }
  };

  const updatePlan = async (id: string, input: UpdatePlanInput) => {
    try {
      const updated = await adminApi.updateAdminPlan(id, input);
      setPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success(t("admin.plans.toastUpdateSuccess", { name: updated.name }));
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.plans.toastUpdateFailed");
      toast.error(msg);
      throw err;
    }
  };

  const deletePlan = async (id: string, planName: string) => {
    try {
      await adminApi.deleteAdminPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success(t("admin.plans.toastDeleteSuccess", { name: planName }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.plans.toastDeleteFailed");
      toast.error(msg);
      throw err;
    }
  };

  const filteredPlans = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return plans;
    return plans.filter((p) => p.name.toLowerCase().includes(q));
  }, [plans, searchQuery]);

  const total = filteredPlans.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedPlans = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, page, pageSize]);

  const executeSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  const setPageNumber = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
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

  return {
    plans,
    filteredPlans,
    paginatedPlans,
    isLoading,
    searchQuery,
    page,
    pageSize,
    total,
    totalPages,
    createPlan,
    updatePlan,
    deletePlan,
    executeSearch,
    clearSearch,
    setPage: setPageNumber,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
    fetchPlans,
  };
}
