"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { wabaApi } from "../api/waba.api";
import { campaignApi } from "@/modules/campaign/api/campaign.api";
import { WABAAccount } from "../types/waba.types";
import { MessageLogResponse } from "@/modules/campaign/types/campaign.types";

export type WABAStatsTimeRange = "today" | "7d" | "30d";

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
  const [accounts, setAccounts] = useState<WABAAccount[]>([]);
  const [logs, setLogs] = useState<MessageLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const [accountsRes, logsRes] = await Promise.all([
        wabaApi.getAccounts(signal).catch(() => []),
        campaignApi
          .getMessageLogs({ pageSize: 200, signal })
          .catch(() => ({ logs: [], total: 0 })),
      ]);

      setAccounts(accountsRes);
      setLogs(logsRes.logs || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Gagal memuat statistik Meta WABA",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    }

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
      if (log.campaign_id && log.campaign_id.trim() !== "") {
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
  }, [accounts, logs, timeRange]);

  return {
    timeRange,
    setTimeRange,
    accounts,
    logs,
    stats: statsData,
    isLoading,
    error,
    refetch: () => fetchData(),
  };
}

export default useWABAStats;
