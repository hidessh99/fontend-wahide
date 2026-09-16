"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageLogResponse } from "../types/campaign.types";
import { campaignApi } from "../api/campaign.api";

export function useMessageLogs(initialPage = 1, initialPageSize = 10) {
  const [logs, setLogs] = useState<MessageLogResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deviceIdFilter, setDeviceIdFilter] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset page to 1 when search, filter, or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, deviceIdFilter, pageSize]);

  const fetchLogs = useCallback(
    async (
      overrideParams?: {
        page?: number;
        pageSize?: number;
        search?: string;
        status?: string;
        deviceId?: string;
      },
      signal?: AbortSignal,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await campaignApi.getMessageLogs({
          page: overrideParams?.page ?? page,
          pageSize: overrideParams?.pageSize ?? pageSize,
          search:
            overrideParams?.search !== undefined
              ? overrideParams.search
              : searchQuery,
          status:
            overrideParams?.status !== undefined
              ? overrideParams.status
              : statusFilter,
          deviceId:
            overrideParams?.deviceId !== undefined
              ? overrideParams.deviceId
              : deviceIdFilter,
          signal,
        });
        setLogs(res.logs);
        setTotal(res.total);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error ? err.message : "Gagal memuat log pesan";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, searchQuery, statusFilter, deviceIdFilter],
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await campaignApi.getMessageLogs({
          page,
          pageSize,
          search: searchQuery,
          status: statusFilter,
          deviceId: deviceIdFilter,
          signal: controller.signal,
        });
        if (isMounted) {
          setLogs(res.logs);
          setTotal(res.total);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Gagal memuat log pesan";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLogs();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, pageSize, searchQuery, statusFilter, deviceIdFilter]);

  return {
    logs,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    deviceIdFilter,
    setDeviceIdFilter,
    isLoading,
    error,
    fetchLogs,
  };
}
