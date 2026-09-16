"use client";

import { useState, useEffect, useCallback } from "react";
import { telegramApi } from "../api/telegram.api";
import { TelegramMessage, TelegramMessageDirection, TelegramMessageStatus } from "../types/telegram.types";

export function useTelegramLogs(initialPage = 1, initialPageSize = 20) {
  const [logs, setLogs] = useState<TelegramMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [botIdFilter, setBotIdFilter] = useState<string | undefined>(undefined);
  const [directionFilter, setDirectionFilter] = useState<"ALL" | TelegramMessageDirection>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TelegramMessageStatus>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, botIdFilter, directionFilter, statusFilter]);

  const fetchLogs = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await telegramApi.getMessageLogs(
          {
            page,
            page_size: pageSize,
            search: debouncedSearch,
            bot_id: botIdFilter,
            direction: directionFilter,
            status: statusFilter,
          },
          signal,
        );
        setLogs(res.logs);
        setTotal(res.total);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Gagal memuat log pesan Telegram";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, debouncedSearch, botIdFilter, directionFilter, statusFilter],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchLogs(controller.signal);
    return () => controller.abort();
  }, [fetchLogs]);

  return {
    logs,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    botIdFilter,
    setBotIdFilter,
    directionFilter,
    setDirectionFilter,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    reload: fetchLogs,
  };
}
