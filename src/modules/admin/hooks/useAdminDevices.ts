"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import { AdminDeviceItem } from "@/modules/admin/types/admin.types";
import { adminApi } from "@/modules/admin/api/admin.api";
import { toast } from "sonner";

export function useAdminDevices() {
  const { t } = useI18n();
  const [devices, setDevices] = useState<AdminDeviceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAdminDevices({
        page,
        pageSize,
        search: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      });

      setDevices(res.devices);
      setTotal(res.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.devices.toastFetchFailed");
      toast.error(msg);
      setDevices([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, t]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getAdminDevices({
          page,
          pageSize,
          search: searchQuery || undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        });
        if (isMounted) {
          setDevices(res.devices);
          setTotal(res.total);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setDevices([]);
          setTotal(0);
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, searchQuery, statusFilter]);

  const deleteDevice = async (id: string) => {
    try {
      await adminApi.deleteAdminDevice(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success(t("admin.devices.toastDeleteSuccess"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("admin.devices.toastDeleteFailed");
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
    const onlineCount = devices.filter((d) => d.status === "ONLINE").length;
    const offlineCount = devices.filter((d) => d.status === "OFFLINE").length;
    const qrPendingCount = devices.filter((d) => d.status === "QR_PENDING").length;
    const hibernatedCount = devices.filter((d) => d.status === "HIBERNATED").length;
    const bannedCount = devices.filter((d) => d.status === "BANNED").length;

    return {
      totalCount: total,
      onlineCount,
      offlineCount,
      qrPendingCount,
      hibernatedCount,
      bannedCount,
    };
  }, [devices, total]);

  return {
    devices,
    isLoading,
    searchQuery,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    fetchDevices,
    deleteDevice,
    executeSearch,
    clearSearch,
    setStatusFilter: changeStatusFilter,
    setPage: setPageNumber,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
  };
}
