"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { whatsappApi } from "../api/whatsapp.api";
import { campaignApi } from "@/modules/campaign/api/campaign.api";
import { Device } from "../types/whatsapp.types";
import {
  MessageLogResponse,
  ChannelStatsResponse,
} from "@/modules/campaign/types/campaign.types";
import { type DateRange } from "@/components/ui/date-range-picker";

export type WhatsAppStatsTimeRange = "today" | "7d" | "30d" | "custom";
export type WhatsAppStatsCategory = "ALL" | "DIRECT" | "OTP" | "BROADCAST";

export interface DailyActivityPoint {
  dateKey: string;
  label: string;
  delivered: number;
  failed: number;
  total: number;
}

export interface TopSendTypesData {
  directCount: number;
  directPercent: number;
  campaignCount: number;
  campaignPercent: number;
  total: number;
}

export interface DeviceVolumeData {
  id: string;
  pushName: string;
  phone: string | null;
  status: string;
  count: number;
  percent: number;
}

export interface WhatsAppStatsData {
  totalSends: number;
  deliveredCount: number;
  deliveryRate: number;
  failedCount: number;
  failureRate: number;
  dailyActivity: DailyActivityPoint[];
  topSendTypes: TopSendTypesData;
  byNumber: DeviceVolumeData[];
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

export function useWhatsAppStats() {
  const [timeRange, setTimeRange] =
    useState<WhatsAppStatsTimeRange>("today");
  const [categoryFilter, setCategoryFilter] =
    useState<WhatsAppStatsCategory>("ALL");
  const [customRange, setCustomRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [devices, setDevices] = useState<Device[]>([]);
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

      const [devicesRes, statsRes, logsRes] = await Promise.all([
        whatsappApi.getDevices(signal).catch(() => []),
        campaignApi
          .getChannelStats(
            {
              channelType: "WHATSMEOW_UNOFFICIAL",
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
              channelType: "WHATSMEOW_UNOFFICIAL",
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

      setDevices(devicesRes);
      setServerStats(statsRes);
      setLogs(logsRes.logs || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Gagal memuat statistik WhatsApp",
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

  const statsData: WhatsAppStatsData = useMemo(() => {
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

      const dailyActivity: DailyActivityPoint[] = (serverStats.daily_activity || []).map((d) => ({
        dateKey: d.date_key,
        label: d.label || d.date_key,
        delivered: d.delivered,
        failed: d.failed,
        total: d.total,
      }));

      const deviceMetaMap = new Map<string, Device>();
      devices.forEach((d) => deviceMetaMap.set(d.id, d));

      const byNumber: DeviceVolumeData[] = (serverStats.by_device || []).map((dv) => {
        const meta = deviceMetaMap.get(dv.device_id);
        return {
          id: dv.device_id,
          pushName: meta?.push_name || meta?.pushName || meta?.name || dv.name || "WhatsApp Slot",
          phone: meta?.phone || dv.phone || null,
          status: meta?.status || "CONNECTED",
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
      const topSendTypes: TopSendTypesData = {
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
    const filteredLogs = logs.filter((log) => {
      if (log.direction && log.direction.toUpperCase() === "INBOUND") {
        return false;
      }
      const logTime = new Date(log.created_at || log.sent_at).getTime();
      return !isNaN(logTime) && logTime >= cutoffTime;
    });

    let deliveredCount = filteredLogs.filter(
      (l) => l.status === "DELIVERED" || l.status === "READ",
    ).length;
    const failedCount = filteredLogs.filter((l) => l.status === "FAILED").length;
    let totalSends = deliveredCount + failedCount;

    // Cross-check with devices dailySentCount for 'today'
    if (timeRange === "today") {
      const devicesDailySent = devices.reduce(
        (acc, d) => acc + (d.dailySentCount || 0),
        0,
      );
      if (devicesDailySent > totalSends) {
        totalSends = devicesDailySent;
        if (deliveredCount === 0 && failedCount === 0) {
          deliveredCount = devicesDailySent;
        }
      }
    }

    const deliveryRate =
      totalSends > 0 ? Math.round((deliveredCount / totalSends) * 100) : 0;
    const failureRate =
      totalSends > 0 ? Math.round((failedCount / totalSends) * 100) : 0;

    // Construct daily bucket activity
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
      // Pre-fill all days in range to show smooth timeline
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

    const dailyActivity: DailyActivityPoint[] = Array.from(
      dailyMap.entries(),
    ).map(([dateKey, val]) => ({
      dateKey,
      label: val.label,
      delivered: val.delivered,
      failed: val.failed,
      total: val.delivered + val.failed,
    }));

    // Top send types breakdown
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
    const topSendTypes: TopSendTypesData = {
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

    // Device leaderboard breakdown
    const deviceMap = new Map<string, number>();
    filteredLogs.forEach((log) => {
      if (log.device_id) {
        deviceMap.set(log.device_id, (deviceMap.get(log.device_id) || 0) + 1);
      }
    });

    const byNumber: DeviceVolumeData[] = devices
      .map((device) => {
        let count = deviceMap.get(device.id) || 0;
        if (
          timeRange === "today" &&
          device.dailySentCount &&
          device.dailySentCount > count
        ) {
          count = device.dailySentCount;
        }

        return {
          id: device.id,
          pushName:
            device.push_name ||
            device.pushName ||
            device.name ||
            "WhatsApp Slot",
          phone: device.phone || null,
          status: device.status,
          count,
          percent:
            totalSends > 0 ? Math.round((count / totalSends) * 100) : 0,
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
  }, [devices, logs, serverStats, timeRange, categoryFilter, customRange]);

  return {
    timeRange,
    setTimeRange,
    categoryFilter,
    setCategoryFilter,
    customRange,
    setCustomRange,
    devices,
    logs,
    stats: statsData,
    isLoading,
    error,
    refetch: () => fetchData(),
  };
}

export default useWhatsAppStats;
