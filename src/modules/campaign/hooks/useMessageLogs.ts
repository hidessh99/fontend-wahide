"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageLogResponse } from "../types/campaign.types";
import { campaignApi } from "../api/campaign.api";
import {
  LogTimeRange,
  resolveDateRangeISO,
} from "@/components/ui/log-period-filter";
import { DateRange } from "@/components/ui/date-range-picker";

export function useMessageLogs(initialPage = 1, initialPageSize = 10) {
  const [logs, setLogs] = useState<MessageLogResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [messageTypeFilter, setMessageTypeFilter] = useState<string>("ALL");
  const [timeRange, setTimeRange] = useState<LogTimeRange>("all");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [deviceIdFilter, setDeviceIdFilter] = useState<string | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedTotal, setFailedTotal] = useState(0);

  // Reset page to 1 when search, filter, period, or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    statusFilter,
    messageTypeFilter,
    timeRange,
    customRange,
    deviceIdFilter,
    pageSize,
  ]);

  const fetchLogs = useCallback(
    async (
      overrideParams?: {
        page?: number;
        pageSize?: number;
        search?: string;
        status?: string;
        messageType?: string;
        deviceId?: string;
        timeRange?: LogTimeRange;
        customRange?: DateRange;
      },
      signal?: AbortSignal,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const targetStatus =
          overrideParams?.status !== undefined
            ? overrideParams.status
            : statusFilter;
        const targetSearch =
          overrideParams?.search !== undefined
            ? overrideParams.search
            : searchQuery;
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
          campaignApi.getMessageLogs({
            page: overrideParams?.page ?? page,
            pageSize: overrideParams?.pageSize ?? pageSize,
            search: targetSearch,
            status: targetStatus,
            messageType: targetMessageType !== "ALL" ? targetMessageType : undefined,
            deviceId:
              overrideParams?.deviceId !== undefined
                ? overrideParams.deviceId
                : deviceIdFilter,
            startDate,
            endDate,
            signal,
          }),
          targetStatus === "ALL" && !targetSearch
            ? campaignApi
                .getMessageLogs({
                  status: "FAILED",
                  messageType: targetMessageType !== "ALL" ? targetMessageType : undefined,
                  startDate,
                  endDate,
                  pageSize: 1,
                  signal,
                })
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
          err instanceof Error ? err.message : "Gagal memuat log pesan";
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
      messageTypeFilter,
      timeRange,
      customRange,
      deviceIdFilter,
    ],
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { startDate, endDate } = resolveDateRangeISO(
          timeRange,
          customRange,
        );

        const [res, failedProbe] = await Promise.all([
          campaignApi.getMessageLogs({
            page,
            pageSize,
            search: searchQuery,
            status: statusFilter,
            messageType: messageTypeFilter !== "ALL" ? messageTypeFilter : undefined,
            deviceId: deviceIdFilter,
            startDate,
            endDate,
            signal: controller.signal,
          }),
          statusFilter === "ALL" && !searchQuery
            ? campaignApi
                .getMessageLogs({
                  status: "FAILED",
                  messageType: messageTypeFilter !== "ALL" ? messageTypeFilter : undefined,
                  startDate,
                  endDate,
                  pageSize: 1,
                  signal: controller.signal,
                })
                .catch(() => null)
            : Promise.resolve(null),
        ]);

        if (isMounted) {
          setLogs(res.logs);
          setTotal(res.total);
          if (statusFilter === "FAILED") {
            setFailedTotal(res.total);
          } else if (failedProbe) {
            setFailedTotal(failedProbe.total);
          }
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
  }, [
    page,
    pageSize,
    searchQuery,
    statusFilter,
    messageTypeFilter,
    timeRange,
    customRange,
    deviceIdFilter,
  ]);

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
    messageTypeFilter,
    setMessageTypeFilter,
    timeRange,
    setTimeRange,
    customRange,
    setCustomRange,
    deviceIdFilter,
    setDeviceIdFilter,
    isLoading,
    error,
    fetchLogs,
  };
}
