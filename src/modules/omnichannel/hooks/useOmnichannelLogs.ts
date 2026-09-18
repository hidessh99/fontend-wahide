"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { campaignApi } from "@/modules/campaign/api/campaign.api";
import { telegramApi } from "@/modules/telegram/api/telegram.api";
import {
  OmnichannelChannelType,
  UnifiedMessageLog,
  OmnichannelStats,
} from "../types/omnichannel.types";

export type OmnichannelChannelFilter = "ALL" | OmnichannelChannelType;

export function useOmnichannelLogs(initialPage = 1, initialPageSize = 20) {
  const [logs, setLogs] = useState<UnifiedMessageLog[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] =
    useState<OmnichannelChannelFilter>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination on filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, channelFilter]);

  const fetchLogs = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);

      try {
        if (channelFilter === "TELEGRAM_BOT") {
          // Query Telegram Message Logs
          const res = await telegramApi.getMessageLogs(
            {
              page,
              page_size: pageSize,
              search: debouncedSearch,
              status:
                statusFilter !== "ALL"
                  ? (statusFilter as "QUEUED" | "SENT" | "DELIVERED" | "FAILED")
                  : undefined,
            },
            signal,
          );

          const unified: UnifiedMessageLog[] = res.logs.map((t) => ({
            id: t.id,
            channelType: "TELEGRAM_BOT",
            senderName: "Telegram Bot",
            senderIdentifier: t.bot_id,
            recipient: String(t.chat_id),
            direction: t.direction,
            messageBody: t.text || (t.media_url ? "[Media Attachment]" : ""),
            mediaUrl: t.media_url,
            status:
              t.status === "QUEUED"
                ? "QUEUED"
                : t.status === "SENT"
                  ? "SENT"
                  : t.status === "DELIVERED"
                    ? "DELIVERED"
                    : "FAILED",
            errorMessage: t.error_reason,
            createdAt: t.created_at,
            sentAt: t.sent_at,
          }));

          setLogs(unified);
          setTotal(res.total);
        } else {
          // Query WhatsApp Web / WABA Campaign Logs
          const res = await campaignApi.getMessageLogs({
            page,
            pageSize,
            search: debouncedSearch,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            signal,
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const unified: UnifiedMessageLog[] = res.logs.map((item: any) => {
            const isWaba =
              item.channel_type === "META_WABA_OFFICIAL" ||
              item.channelType === "META_WABA_OFFICIAL";
            const channelType: OmnichannelChannelType = isWaba
              ? "META_WABA_OFFICIAL"
              : "WHATSMEOW_UNOFFICIAL";

            return {
              id: item.id,
              channelType,
              senderName: isWaba ? "Meta WABA Official" : "WhatsApp Device",
              senderIdentifier: item.device_id || item.deviceId || "Default",
              recipient: item.recipient_jid || item.recipientJid || "-",
              direction: (item.direction?.toUpperCase() ||
                "OUTBOUND") as "INBOUND" | "OUTBOUND",
              messageBody: item.message_body || item.messageBody || "",
              mediaUrl: item.media_url || item.mediaUrl,
              status: (item.status?.toUpperCase() || "SENT") as
                | "PENDING"
                | "SENT"
                | "DELIVERED"
                | "READ"
                | "FAILED",
              errorMessage: item.error_message || item.errorMessage,
              createdAt:
                item.created_at || item.createdAt || new Date().toISOString(),
              sentAt: item.sent_at || item.sentAt,
            };
          });

          // If filtering specifically by WhatsApp Web or Meta WABA
          const filtered =
            channelFilter === "ALL"
              ? unified
              : unified.filter((l) => l.channelType === channelFilter);

          setLogs(filtered);
          setTotal(channelFilter === "ALL" ? res.total : filtered.length);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error ? err.message : "Gagal memuat riwayat log";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, debouncedSearch, statusFilter, channelFilter],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchLogs(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchLogs]);

  // Derived statistics
  const stats = useMemo<OmnichannelStats>(() => {
    const totalCount = total;
    const failed = logs.filter((l) => l.status === "FAILED").length;
    const sent = logs.filter(
      (l) =>
        l.status === "SENT" ||
        l.status === "DELIVERED" ||
        l.status === "READ",
    ).length;

    const rate =
      totalCount > 0 ? Math.round((sent / Math.max(1, totalCount)) * 100) : 100;

    return {
      totalMessages: totalCount,
      sentCount: sent,
      failedCount: failed,
      successRate: rate,
      byChannel: {
        waWeb: {
          total: logs.filter((l) => l.channelType === "WHATSMEOW_UNOFFICIAL")
            .length,
          sent: logs.filter(
            (l) =>
              l.channelType === "WHATSMEOW_UNOFFICIAL" &&
              l.status !== "FAILED",
          ).length,
          failed: logs.filter(
            (l) =>
              l.channelType === "WHATSMEOW_UNOFFICIAL" &&
              l.status === "FAILED",
          ).length,
        },
        waba: {
          total: logs.filter((l) => l.channelType === "META_WABA_OFFICIAL")
            .length,
          sent: logs.filter(
            (l) =>
              l.channelType === "META_WABA_OFFICIAL" && l.status !== "FAILED",
          ).length,
          failed: logs.filter(
            (l) =>
              l.channelType === "META_WABA_OFFICIAL" && l.status === "FAILED",
          ).length,
        },
        telegram: {
          total: logs.filter((l) => l.channelType === "TELEGRAM_BOT").length,
          sent: logs.filter(
            (l) => l.channelType === "TELEGRAM_BOT" && l.status !== "FAILED",
          ).length,
          failed: logs.filter(
            (l) => l.channelType === "TELEGRAM_BOT" && l.status === "FAILED",
          ).length,
        },
      },
    };
  }, [logs, total]);

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
    channelFilter,
    setChannelFilter,
    isLoading,
    error,
    refreshLogs: fetchLogs,
    stats,
  };
}
