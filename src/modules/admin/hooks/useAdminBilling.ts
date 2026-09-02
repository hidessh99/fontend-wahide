"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AdminBillingItem, BillingStatus } from "../types/admin.types";
import { adminApi } from "../api/admin.api";
import { toast } from "sonner";

export function useAdminBilling() {
  const [billings, setBillings] = useState<AdminBillingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchBillings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAdminBillings({
        page,
        pageSize,
        search: searchQuery,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      });
      setBillings(res.billings);
      setTotal(res.total);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getAdminBillings({
          page,
          pageSize,
          search: searchQuery,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        });
        if (isMounted) {
          setBillings(res.billings);
          setTotal(res.total);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, searchQuery, statusFilter]);

  const updateStatus = async (id: string, status: "EXPIRED" | "CANCELLED") => {
    try {
      await adminApi.updateAdminBillingStatus(id, { status });
      setBillings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: status as BillingStatus } : b))
      );
      toast.success(
        status === "EXPIRED"
          ? "Transaksi berhasil ditandai Kadaluarsa (EXPIRED)."
          : "Transaksi berhasil dibatalkan (CANCELLED)."
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui status transaksi";
      toast.error(msg);
      throw err;
    }
  };

  const deleteBilling = async (id: string) => {
    try {
      await adminApi.deleteAdminBilling(id);
      setBillings((prev) => prev.filter((b) => b.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success("Catatan transaksi billing berhasil dihapus.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus transaksi";
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

  // Summary Metrics
  const metrics = useMemo(() => {
    const paidTotal = billings
      .filter((b) => b.status === "PAID")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const pendingCount = billings.filter((b) => b.status === "PENDING" || b.status === "PROCESSING").length;
    const closedCount = billings.filter((b) => b.status === "EXPIRED" || b.status === "CANCELLED").length;

    return {
      paidTotal,
      pendingCount,
      closedCount,
      totalCount: total,
    };
  }, [billings, total]);

  return {
    billings,
    isLoading,
    searchQuery,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    updateStatus,
    deleteBilling,
    executeSearch,
    clearSearch,
    setStatusFilter: changeStatusFilter,
    setPage: setPageNumber,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
    fetchBillings,
  };
}
