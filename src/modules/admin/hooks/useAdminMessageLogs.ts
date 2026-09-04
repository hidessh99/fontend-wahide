"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
import { adminApi } from "@/modules/admin/api/admin.api";
import { toast } from "sonner";

export function useAdminMessageLogs() {
  const { t } = useI18n();
  const [logs, setLogs] = useState<AdminMessageLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [directionFilter, setDirectionFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAdminMessageLogs({
        page,
        pageSize,
        search: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        direction: directionFilter !== "ALL" ? directionFilter : undefined,
      });

      setLogs(res.logs);
      setTotal(res.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.messages.toastFetchFailed");
      toast.error(msg);
      setLogs([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, directionFilter, t]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getAdminMessageLogs(
          {
            page,
            pageSize,
            search: searchQuery || undefined,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            direction: directionFilter !== "ALL" ? directionFilter : undefined,
          },
          controller.signal
        );
        if (!controller.signal.aborted) {
          setLogs(res.logs);
          setTotal(res.total);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setLogs([]);
          setTotal(0);
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      controller.abort();
    };
  }, [page, pageSize, searchQuery, statusFilter, directionFilter]);

  const deleteLog = async (id: string) => {
    try {
      await adminApi.deleteAdminMessageLog(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success(t("admin.messages.toastDeleteSuccess"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.messages.toastDeleteFailed");
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

  const changeDirectionFilter = (dir: string) => {
    setDirectionFilter(dir);
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
    const sentCount = logs.filter((l) => l.status === "SENT").length;
    const deliveredCount = logs.filter((l) => l.status === "DELIVERED").length;
    const readCount = logs.filter((l) => l.status === "READ").length;
    const failedCount = logs.filter((l) => l.status === "FAILED").length;
    const pendingCount = logs.filter((l) => l.status === "PENDING").length;
    const outboundCount = logs.filter((l) => l.direction === "OUTBOUND").length;
    const inboundCount = logs.filter((l) => l.direction === "INBOUND").length;

    return {
      totalCount: total,
      sentCount,
      deliveredCount,
      readCount,
      failedCount,
      pendingCount,
      outboundCount,
      inboundCount,
    };
  }, [logs, total]);

  return {
    logs,
    isLoading,
    searchQuery,
    statusFilter,
    directionFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    fetchLogs,
    deleteLog,
    executeSearch,
    clearSearch,
    setStatusFilter: changeStatusFilter,
    setDirectionFilter: changeDirectionFilter,
    setPage: setPageNumber,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
  };
}
