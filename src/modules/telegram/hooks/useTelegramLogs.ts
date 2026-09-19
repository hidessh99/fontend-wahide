"use client";

import { useState, useEffect, useCallback } from "react";
import { telegramApi } from "../api/telegram.api";
import {
  TelegramMessage,
  TelegramMessageDirection,
  TelegramMessageStatus,
} from "../types/telegram.types";

export function useTelegramLogs(initialPage = 1, initialPageSize = 10) {
  const [logs, setLogs] = useState<TelegramMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [failedTotal, setFailedTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [botIdFilter, setBotIdFilter] = useState<string | undefined>(undefined);
  const [directionFilter, setDirectionFilter] = useState<
    "ALL" | TelegramMessageDirection
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | TelegramMessageStatus
  >("ALL");
  const [messageCategory, setMessageCategory] = useState<
    "ALL" | "DIRECT" | "OTP" | "BROADCAST"
  >("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset page to 1 on filter or pagination size changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, botIdFilter, directionFilter, statusFilter, messageCategory, pageSize]);

  const fetchLogs = useCallback(
    async (
      overrideParams?: {
        page?: number;
        pageSize?: number;
        search?: string;
        direction?: "ALL" | TelegramMessageDirection;
        status?: "ALL" | TelegramMessageStatus;
        botId?: string;
      },
      signal?: AbortSignal,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const targetPage = overrideParams?.page ?? page;
        const targetPageSize = overrideParams?.pageSize ?? pageSize;
        const targetSearch =
          overrideParams?.search !== undefined
            ? overrideParams.search
            : searchQuery;
        const targetDirection =
          overrideParams?.direction !== undefined
            ? overrideParams.direction
            : directionFilter;
        const targetStatus =
          overrideParams?.status !== undefined
            ? overrideParams.status
            : statusFilter;
        const targetBotId =
          overrideParams?.botId !== undefined
            ? overrideParams.botId
            : botIdFilter;

        if (messageCategory === "OTP" || messageCategory === "BROADCAST") {
          setLogs([]);
          setTotal(0);
          setFailedTotal(0);
          return;
        }

        const [res, failedProbe] = await Promise.all([
          telegramApi.getMessageLogs(
            {
              page: targetPage,
              page_size: targetPageSize,
              search: targetSearch,
              bot_id: targetBotId,
              direction: targetDirection,
              status: targetStatus,
            },
            signal,
          ),
          targetStatus === "ALL" && !targetSearch
            ? telegramApi
                .getMessageLogs(
                  {
                    status: "FAILED",
                    page_size: 1,
                    bot_id: targetBotId,
                  },
                  signal,
                )
                .catch(() => null)
            : Promise.resolve(null),
        ]);

        setLogs(res.logs);
        setTotal(res.total);
        if (targetStatus === "FAILED") {
          setFailedTotal(res.total);
        } else if (failedProbe) {
          setFailedTotal(failedProbe.total);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error
            ? err.message
            : "Gagal memuat log pesan Telegram";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, searchQuery, botIdFilter, directionFilter, statusFilter, messageCategory],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchLogs(undefined, controller.signal);
    return () => controller.abort();
  }, [fetchLogs]);

  return {
    logs,
    total,
    failedTotal,
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
    messageCategory,
    setMessageCategory,
    isLoading,
    error,
    reload: fetchLogs,
  };
}
