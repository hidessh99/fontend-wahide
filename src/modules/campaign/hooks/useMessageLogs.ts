"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageLogResponse } from "../types/campaign.types";
import { campaignApi } from "../api/campaign.api";

export function useMessageLogs(initialPage = 1, initialPageSize = 20) {
  const [logs, setLogs] = useState<MessageLogResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(
    async (targetPage = page, targetSize = pageSize) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await campaignApi.getMessageLogs(targetPage, targetSize);
        setLogs(res.logs);
        setTotal(res.total);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal memuat log pesan";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    let isMounted = true;
    const loadLogs = async () => {
      try {
        const res = await campaignApi.getMessageLogs(page, pageSize);
        if (isMounted) {
          setLogs(res.logs);
          setTotal(res.total);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Gagal memuat log pesan";
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
    };
  }, [page, pageSize]);

  return {
    logs,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    error,
    fetchLogs,
  };
}
