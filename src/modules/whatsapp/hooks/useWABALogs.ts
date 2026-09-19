"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageLogResponse } from "@/modules/campaign/types/campaign.types";
import { campaignApi } from "@/modules/campaign/api/campaign.api";
import {
  LogTimeRange,
  resolveDateRangeISO,
} from "@/components/ui/log-period-filter";
import { DateRange } from "@/components/ui/date-range-picker";

export function useWABALogs(initialPage = 1, initialPageSize = 10) {
  const [logs, setLogs] = useState<MessageLogResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [failedTotal, setFailedTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [messageTypeFilter, setMessageTypeFilter] = useState("ALL");
  const [timeRange, setTimeRange] = useState<LogTimeRange>("all");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset page to 1 when search, filter, period, or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    statusFilter,
    messageTypeFilter,
    categoryFilter,
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
        status?: string;
        category?: string;
        messageType?: string;
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
        const targetStatus =
          overrideParams?.status !== undefined
            ? overrideParams.status
            : statusFilter;
        const targetSearch =
          overrideParams?.search !== undefined
            ? overrideParams.search
            : searchQuery;
        const targetCategory =
          overrideParams?.category !== undefined
            ? overrideParams.category
            : categoryFilter;
        const targetMessageType =
          overrideParams?.messageType !== undefined
            ? overrideParams.messageType
            : messageTypeFilter;
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
          campaignApi.getMessageLogs(
            {
              page: targetPage,
              pageSize: targetPageSize,
              search: targetSearch,
              status: targetStatus,
              channelType: "META_WABA_OFFICIAL",
              messageType: targetMessageType !== "ALL" ? targetMessageType : undefined,
              startDate,
              endDate,
              signal,
            },
            targetPageSize,
            signal,
          ),
          targetStatus === "ALL" && !targetSearch
            ? campaignApi
                .getMessageLogs(
                  {
                    status: "FAILED",
                    pageSize: 1,
                    channelType: "META_WABA_OFFICIAL",
                    messageType: targetMessageType !== "ALL" ? targetMessageType : undefined,
                    startDate,
                    endDate,
                    signal,
                  },
                  1,
                  signal,
                )
                .catch(() => null)
            : Promise.resolve(null),
        ]);

        let items = res.logs;
        if (targetCategory !== "ALL") {
          items = items.filter(
            (l) => l.waba_info?.conversation_category === targetCategory,
          );
        }

        setLogs(items);
        setTotal(res.total);
        if (targetStatus === "FAILED") {
          setFailedTotal(res.total);
        } else if (failedProbe) {
          setFailedTotal(failedProbe.total);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error ? err.message : "Gagal memuat log pesan Meta WABA";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [
      page,
      pageSize,
      searchQuery,
      statusFilter,
      categoryFilter,
      messageTypeFilter,
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
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    messageTypeFilter,
    setMessageTypeFilter,
    timeRange,
    setTimeRange,
    customRange,
    setCustomRange,
    isLoading,
    error,
    reload: fetchLogs,
  };
}
