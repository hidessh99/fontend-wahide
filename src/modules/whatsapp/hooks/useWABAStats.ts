"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { wabaApi } from "../api/waba.api";
import { campaignApi } from "@/modules/campaign/api/campaign.api";
import { WABAAccount } from "../types/waba.types";
import {
  MessageLogResponse,
  ChannelStatsResponse,
} from "@/modules/campaign/types/campaign.types";
import { type DateRange } from "@/components/ui/date-range-picker";

export type WABAStatsTimeRange = "today" | "7d" | "30d" | "custom";
export type WABAStatsCategory = "ALL" | "DIRECT" | "OTP" | "BROADCAST";

export interface WABADailyActivityPoint {
  dateKey: string;
  label: string;
  delivered: number;
  failed: number;
  total: number;
}

export interface WABATopSendTypesData {
  directCount: number;
  directPercent: number;
  campaignCount: number;
  campaignPercent: number;
  total: number;
}

export interface WABANumberVolumeData {
  id: string;
  name: string;
  phone: string | null;
  phoneNumberId: string;
  qualityRating: string;
  messagingTier: string;
  count: number;
  percent: number;
}

export interface WABAStatsData {
  totalSends: number;
  deliveredCount: number;
  deliveryRate: number;
  failedCount: number;
  failureRate: number;
  dailyActivity: WABADailyActivityPoint[];
  topSendTypes: WABATopSendTypesData;
  byNumber: WABANumberVolumeData[];
  hasActivity: boolean;
}

const getStartOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const formatDateLabel = (date: Date): string => {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

export function useWABAStats() {
  const [timeRange, setTimeRange] = useState<WABAStatsTimeRange>("today");
  const [categoryFilter, setCategoryFilter] =
    useState<WABAStatsCategory>("ALL");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [accounts, setAccounts] = useState<WABAAccount[]>([]);
  const [logs, setLogs] = useState<MessageLogResponse[]>([]);
  const [serverStats, setServerStats] = useState<ChannelStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date();
      let startDate: string | undefined;
      let endDate: string | undefined;

      if (timeRange === "today") {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        startDate = start.toISOString();
        endDate = end.toISOString();
      } else if (timeRange === "7d") {
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
        startDate = start.toISOString();
        endDate = now.toISOString();
      } else if (timeRange === "30d") {
        const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
        startDate = start.toISOString();
        endDate = now.toISOString();
      } else if (timeRange === "custom") {
        if (customRange.from) {
          const start = new Date(customRange.from);
          start.setHours(0, 0, 0, 0);
          startDate = start.toISOString();
        }
        if (customRange.to) {
          const end = new Date(customRange.to);
          end.setHours(23, 59, 59, 999);
          endDate = end.toISOString();
        }
      }

      const [accountsRes, statsRes, logsRes] = await Promise.all([
        wabaApi.getAccounts(signal).catch(() => []),
        campaignApi
          .getChannelStats(
            {
              channelType: "META_WABA_OFFICIAL",
              messageType: categoryFilter !== "ALL" ? categoryFilter : undefined,
              startDate,
              endDate,
            },
            signal,
          )
          .catch(() => null),
        campaignApi
          .getMessageLogs(
            {
              pageSize: 200,
              channelType: "META_WABA_OFFICIAL",
              messageType: categoryFilter !== "ALL" ? categoryFilter : undefined,
              startDate,
              endDate,
              signal,
            },
            200,
            signal,
          )
          .catch(() => ({ logs: [], total: 0 })),
      ]);

      setAccounts(accountsRes);
      setServerStats(statsRes);
      setLogs(logsRes.logs || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Gagal memuat statistik Meta WABA",
      );
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, categoryFilter, customRange]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchData]);

  const statsData: WABAStatsData = useMemo(() => {
    const now = new Date();
    const nowTime = now.getTime();
    let cutoffTime = getStartOfDay(now);
    let daysCount = 1;

    if (timeRange === "7d") {
      cutoffTime = nowTime - 7 * 24 * 60 * 60 * 1000;
      daysCount = 7;
    } else if (timeRange === "30d") {
      cutoffTime = nowTime - 30 * 24 * 60 * 60 * 1000;
      daysCount = 30;
    } else if (timeRange === "custom" && customRange.from) {
      cutoffTime = customRange.from.getTime();
      const endMillis = customRange.to ? customRange.to.getTime() : nowTime;
      daysCount = Math.max(1, Math.ceil((endMillis - cutoffTime) / (24 * 60 * 60 * 1000)));
    }

    // 1. Primary: Use Single-Pass Server Stats from Backend Aggregation if available
    if (serverStats && serverStats.total_sends > 0) {
      const totalSends = serverStats.total_sends;
      const deliveredCount = serverStats.delivered_count + (serverStats.read_count || 0);
      const failedCount = serverStats.failed_count;
      const deliveryRate = serverStats.delivery_rate;
      const failureRate = serverStats.failure_rate;

      const dailyActivity: WABADailyActivityPoint[] = (serverStats.daily_activity || []).map((d) => ({
        dateKey: d.date_key,
        label: d.label || d.date_key,
        delivered: d.delivered,
        failed: d.failed,
        total: d.total,
      }));

      const accountMetaMap = new Map<string, WABAAccount>();
      accounts.forEach((a) => {
        accountMetaMap.set(a.id, a);
        if (a.phone_number_id) accountMetaMap.set(a.phone_number_id, a);
      });

      const byNumber: WABANumberVolumeData[] = (serverStats.by_device || []).map((dv) => {
        const meta = accountMetaMap.get(dv.device_id);
        return {
          id: dv.device_id,
          name: meta?.verified_name || meta?.name || dv.name || "Meta WABA Account",
          phone: meta?.phone_number || dv.phone || null,
          phoneNumberId: meta?.phone_number_id || dv.device_id,
          qualityRating: meta?.meta_quality_rating || "UNKNOWN",
          messagingTier: meta?.meta_messaging_tier || "TIER_250",
          count: dv.count,
          percent: dv.percent || (totalSends > 0 ? Math.round((dv.count / totalSends) * 100) : 0),
        };
      });

      let directCount = 0;
      let campaignCount = 0;
      if (categoryFilter === "DIRECT") {
        directCount = totalSends;
      } else if (categoryFilter === "BROADCAST") {
        campaignCount = totalSends;
      } else {
        logs.forEach((log) => {
          if (log.message_type === "BROADCAST" || (log.campaign_id && log.campaign_id.trim() !== "")) {
            campaignCount += 1;
          } else {
            directCount += 1;
          }
        });
        if (directCount === 0 && campaignCount === 0) {
          directCount = totalSends;
        }
      }

      const sendTypesTotal = directCount + campaignCount;
      const topSendTypes: WABATopSendTypesData = {
        directCount,
        directPercent: sendTypesTotal > 0 ? Math.round((directCount / sendTypesTotal) * 100) : 0,
        campaignCount,
        campaignPercent: sendTypesTotal > 0 ? Math.round((campaignCount / sendTypesTotal) * 100) : 0,
        total: sendTypesTotal,
      };

      return {
        totalSends,
        deliveredCount,
        deliveryRate,
        failedCount,
        failureRate,
        dailyActivity,
        topSendTypes,
        byNumber,
        hasActivity: true,
      };
    }

    // 2. Fallback: Client-Side Logs Compute
    const accountPhoneIds = new Set(accounts.map((a) => a.phone_number_id));
    const accountIds = new Set(accounts.map((a) => a.id));

    // Filter logs specifically belonging to Meta WABA
    const filteredLogs = logs.filter((log) => {
      if (log.direction && log.direction.toUpperCase() === "INBOUND") {
        return false;
      }

      const isWABAChannel =
        log.channel_type === "META_WABA_OFFICIAL" ||
        accountPhoneIds.has(log.device_id) ||
        accountIds.has(log.device_id);

      if (!isWABAChannel && accounts.length > 0) {
        return false;
      }

      const logTime = new Date(log.created_at || log.sent_at).getTime();
      return !isNaN(logTime) && logTime >= cutoffTime;
    });

    const deliveredCount = filteredLogs.filter(
      (l) => l.status === "DELIVERED" || l.status === "READ",
    ).length;
    const failedCount = filteredLogs.filter((l) => l.status === "FAILED").length;
    const totalSends = deliveredCount + failedCount;

    const deliveryRate =
      totalSends > 0 ? Math.round((deliveredCount / totalSends) * 100) : 0;
    const failureRate =
      totalSends > 0 ? Math.round((failedCount / totalSends) * 100) : 0;

    // Daily histogram points
    const dailyMap = new Map<
      string,
      { delivered: number; failed: number; label: string }
    >();

    if (timeRange === "today") {
      const dateLabel = formatDateLabel(now);
      const key = now.toISOString().slice(0, 10);
      dailyMap.set(key, {
        delivered: deliveredCount,
        failed: failedCount,
        label: dateLabel,
      });
    } else {
      for (let i = daysCount - 1; i >= 0; i--) {
        const targetDate = new Date(nowTime - i * 24 * 60 * 60 * 1000);
        const key = targetDate.toISOString().slice(0, 10);
        dailyMap.set(key, {
          delivered: 0,
          failed: 0,
          label: formatDateLabel(targetDate),
        });
      }

      filteredLogs.forEach((log) => {
        const logDate = new Date(log.created_at || log.sent_at);
        if (!isNaN(logDate.getTime())) {
          const key = logDate.toISOString().slice(0, 10);
          const existing = dailyMap.get(key);
          if (existing) {
            if (log.status === "DELIVERED" || log.status === "READ") {
              existing.delivered += 1;
            } else if (log.status === "FAILED") {
              existing.failed += 1;
            }
          }
        }
      });
    }

    const dailyActivity: WABADailyActivityPoint[] = Array.from(
      dailyMap.entries(),
    ).map(([dateKey, val]) => ({
      dateKey,
      label: val.label,
      delivered: val.delivered,
      failed: val.failed,
      total: val.delivered + val.failed,
    }));

    // Top send types breakdown (Direct Utility/Service vs Broadcast Marketing)
    let directCount = 0;
    let campaignCount = 0;

    filteredLogs.forEach((log) => {
      if (log.message_type === "BROADCAST" || (log.campaign_id && log.campaign_id.trim() !== "")) {
        campaignCount += 1;
      } else {
        directCount += 1;
      }
    });

    const sendTypesTotal = directCount + campaignCount;
    const topSendTypes: WABATopSendTypesData = {
      directCount,
      directPercent:
        sendTypesTotal > 0
          ? Math.round((directCount / sendTypesTotal) * 100)
          : 0,
      campaignCount,
      campaignPercent:
        sendTypesTotal > 0
          ? Math.round((campaignCount / sendTypesTotal) * 100)
          : 0,
      total: sendTypesTotal,
    };

    // By Number Leaderboard breakdown
    const deviceMap = new Map<string, number>();
    filteredLogs.forEach((log) => {
      if (log.device_id) {
        deviceMap.set(log.device_id, (deviceMap.get(log.device_id) || 0) + 1);
      }
    });

    const byNumber: WABANumberVolumeData[] = accounts
      .map((acc) => {
        const count =
          (deviceMap.get(acc.phone_number_id) || 0) +
          (deviceMap.get(acc.id) || 0);

        return {
          id: acc.id,
          name: acc.verified_name || acc.name || "Meta WABA Account",
          phone: acc.phone_number || null,
          phoneNumberId: acc.phone_number_id,
          qualityRating: acc.meta_quality_rating || "UNKNOWN",
          messagingTier: acc.meta_messaging_tier || "TIER_250",
          count,
          percent: totalSends > 0 ? Math.round((count / totalSends) * 100) : 0,
        };
      })
      .sort((a, b) => b.count - a.count);

    const hasActivity = totalSends > 0 || filteredLogs.length > 0;

    return {
      totalSends,
      deliveredCount,
      deliveryRate,
      failedCount,
      failureRate,
      dailyActivity,
      topSendTypes,
      byNumber,
      hasActivity,
    };
  }, [accounts, logs, serverStats, timeRange, categoryFilter, customRange]);

  return {
    timeRange,
    setTimeRange,
    categoryFilter,
    setCategoryFilter,
    customRange,
    setCustomRange,
    accounts,
    logs,
    stats: statsData,
    isLoading,
    error,
    refetch: () => fetchData(),
  };
}

export default useWABAStats;
