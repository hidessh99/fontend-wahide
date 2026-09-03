"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AdminPlanItem, CreatePlanInput, UpdatePlanInput } from "../types/admin.types";
import { adminApi } from "../api/admin.api";
import { toast } from "sonner";

export function useAdminPlans() {
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
    let isMounted = true;
    const init = async () => {
      try {
        const data = await adminApi.getAdminPlans();
        if (isMounted) {
          setPlans(data);
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

  const createPlan = async (input: CreatePlanInput) => {
    try {
      const newPlan = await adminApi.createAdminPlan(input);
      setPlans((prev) => [newPlan, ...prev]);
      toast.success(`Paket ${newPlan.name} berhasil ditambahkan.`);
      return newPlan;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan paket baru";
      toast.error(msg);
      throw err;
    }
  };

  const updatePlan = async (id: string, input: UpdatePlanInput) => {
    try {
      const updated = await adminApi.updateAdminPlan(id, input);
      setPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success(`Paket ${updated.name} berhasil diperbarui.`);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui paket";
      toast.error(msg);
      throw err;
    }
  };

  const deletePlan = async (id: string, planName: string) => {
    try {
      await adminApi.deleteAdminPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Paket ${planName} berhasil dihapus.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus paket";
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
