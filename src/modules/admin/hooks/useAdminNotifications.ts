"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AdminQueueItem } from "../types/admin.types";
import { adminApi } from "../api/admin.api";
import { toast } from "sonner";

export function useAdminNotifications() {
  const [queues, setQueues] = useState<AdminQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchQueues = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAdminQueues({
        page,
        pageSize,
        search: searchQuery,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      });
      setQueues(res.queues);
      setTotal(res.total);
    } catch {
      // Handled gracefully
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getAdminQueues({
          page,
          pageSize,
          search: searchQuery,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        });
        if (isMounted) {
          setQueues(res.queues);
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

  const deleteQueue = async (id: string) => {
    try {
      await adminApi.deleteAdminQueue(id);
      setQueues((prev) => prev.filter((q) => q.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success("Tugas antrean berhasil dihapus.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus antrean";
      toast.error(msg);
      throw err;
    }
  };

  const sendBroadcastAll = async (subject: string, message: string) => {
    setIsSending(true);
    try {
      const res = await adminApi.broadcastToAllUsers({ subject, message });
      toast.success(res.message);
      await fetchQueues();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim siaran massal";
      toast.error(msg);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const sendBroadcastSpecific = async (userIds: string[], subject: string, message: string) => {
    setIsSending(true);
    try {
      const res = await adminApi.broadcastToSpecificUsers({ userIds, subject, message });
      toast.success(res.message);
      await fetchQueues();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim siaran target";
      toast.error(msg);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const sendDirectEmail = async (email: string, name: string, subject: string, message: string) => {
    setIsSending(true);
    try {
      const res = await adminApi.createDirectEmailQueue({
        email,
        name,
        subject,
        message,
        taskType: "EMAIL_BROADCAST",
      });
      toast.success(res.message);
      await fetchQueues();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memasukkan email ke antrean";
      toast.error(msg);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const sendDirectEmailsBatch = async (
    targets: { email: string; name?: string }[],
    subject: string,
    message: string
  ) => {
    if (targets.length === 0) return;
    setIsSending(true);
    try {
      let successCount = 0;
      for (const t of targets) {
        await adminApi.createDirectEmailQueue({
          email: t.email,
          name: t.name || "Pengguna",
          subject,
          message,
          taskType: "EMAIL_BROADCAST",
        });
        successCount++;
      }
      toast.success(`Berhasil menjadwalkan ${successCount} email ke antrean worker.`);
      await fetchQueues();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memasukkan email ke antrean";
      toast.error(msg);
      throw err;
    } finally {
      setIsSending(false);
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

  const metrics = useMemo(() => {
    const completedCount = queues.filter((q) => q.status === "COMPLETED").length;
    const processingCount = queues.filter((q) => q.status === "PROCESSING").length;
    const pendingCount = queues.filter((q) => q.status === "PENDING").length;
    const failedCount = queues.filter((q) => q.status === "FAILED").length;

    return {
      totalCount: total,
      completedCount,
      processingCount,
      pendingCount,
      failedCount,
    };
  }, [queues, total]);

  return {
    queues,
    isLoading,
    isSending,
    searchQuery,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    fetchQueues,
    deleteQueue,
    sendBroadcastAll,
    sendBroadcastSpecific,
    sendDirectEmail,
    sendDirectEmailsBatch,
    executeSearch,
    clearSearch,
    setStatusFilter: changeStatusFilter,
    setPage: setPageNumber,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
  };
}
