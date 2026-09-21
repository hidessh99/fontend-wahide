"use client";

import { useState, useEffect, useCallback } from "react";
import { telegramApi } from "../api/telegram.api";
import {
  TelegramMessage,
  TelegramMessageDirection,
  TelegramMessageStatus,
} from "../types/telegram.types";
import {
  LogTimeRange,
  resolveDateRangeISO,
} from "@/components/ui/log-period-filter";
import { DateRange } from "@/components/ui/date-range-picker";

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
  const [timeRange, setTimeRange] = useState<LogTimeRange>("all");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset page to 1 on filter, period, or pagination size changes
  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    botIdFilter,
    directionFilter,
    statusFilter,
    messageCategory,
    timeRange,
    customRange,
    pageSize,
  ]);

  const fetchLogs = useCallback(
    async (
      overrideParams?: {
        page?: number;
        pageSize?: number;
        search?: string;
        direction?: "ALL" | TelegramMessageDirection;
        status?: "ALL" | TelegramMessageStatus;
        messageCategory?: "ALL" | "DIRECT" | "OTP" | "BROADCAST";
        botId?: string;
        timeRange?: LogTimeRange;
        customRange?: DateRange;
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
        const targetCategory =
          overrideParams?.messageCategory !== undefined
            ? overrideParams.messageCategory
            : messageCategory;
        const targetBotId =
          overrideParams?.botId !== undefined
            ? overrideParams.botId
            : botIdFilter;
        const targetTimeRange =
          overrideParams?.timeRange !== undefined
            ? overrideParams.timeRange
            : timeRange;
        const targetCustomRange =
          overrideParams?.customRange !== undefined
            ? overrideParams.customRange
            : customRange;

        const { startDate, endDate } = resolveDateRangeISO(
          targetTimeRange,
          targetCustomRange,
        );

        const [res, failedProbe] = await Promise.all([
          telegramApi.getMessageLogs(
            {
              page: targetPage,
              page_size: targetPageSize,
              search: targetSearch,
              bot_id: targetBotId,
              direction: targetDirection,
              status: targetStatus,
              message_type: targetCategory !== "ALL" ? targetCategory : undefined,
              start_date: startDate,
              end_date: endDate,
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
                    message_type: targetCategory !== "ALL" ? targetCategory : undefined,
                    start_date: startDate,
                    end_date: endDate,
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
    [
      page,
      pageSize,
      searchQuery,
      botIdFilter,
      directionFilter,
      statusFilter,
      messageCategory,
      timeRange,
      customRange,
    ],
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
    timeRange,
    setTimeRange,
    customRange,
    setCustomRange,
    isLoading,
    error,
    reload: fetchLogs,
  };
}
