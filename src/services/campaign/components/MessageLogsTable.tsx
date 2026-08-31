"use client";

import React, { useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search, CheckCheck, Check, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export interface MessageLogItem {
  id: string;
  campaignName: string;
  recipientPhone: string;
  recipientName?: string;
  messageSnippet: string;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  sentAt: string;
  errorMessage?: string;
}

const DEFAULT_LOGS: MessageLogItem[] = [
  {
    id: "log_01",
    campaignName: "Promo Merdeka Flash Sale",
    recipientPhone: "6281234567890",
    recipientName: "Budi Santoso",
    messageSnippet: "Halo Budi! Dapatkan diskon 30% khusus hari ini...",
    status: "READ",
    sentAt: "2026-08-30T10:15:20Z",
  },
  {
    id: "log_02",
    campaignName: "Promo Merdeka Flash Sale",
    recipientPhone: "6285799887766",
    recipientName: "Siti Rahma",
    messageSnippet: "Hai Siti! Dapatkan diskon 30% khusus hari ini...",
    status: "DELIVERED",
    sentAt: "2026-08-30T10:15:25Z",
  },
  {
    id: "log_03",
    campaignName: "Follow Up Member VIP",
    recipientPhone: "6281987654321",
    recipientName: "Ahmad Dani",
    messageSnippet: "Selamat siang Ahmad, kupon cashback Anda akan hangus...",
    status: "FAILED",
    errorMessage: "Nomor tidak terdaftar di WhatsApp",
    sentAt: "2026-08-30T11:00:10Z",
  },
];

export function MessageLogsTable() {
  const { t } = useI18n();
  const [logs] = useState<MessageLogItem[]>(DEFAULT_LOGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      search === "" ||
      l.recipientPhone.includes(search) ||
      (l.recipientName && l.recipientName.toLowerCase().includes(search.toLowerCase())) ||
      l.campaignName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // High-Throughput DOM Virtualization
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const renderStatusBadge = (status: MessageLogItem["status"]) => {
    switch (status) {
      case "READ":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-500">
            <CheckCheck className="size-3.5" />
            <span>{t("campaign.statusRead")}</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCheck className="size-3.5" />
            <span>{t("campaign.statusDelivered")}</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            <AlertCircle className="size-3.5" />
            <span>{t("campaign.statusFailed")}</span>
          </span>
        );
      case "SENT":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-foreground-muted">
            <Check className="size-3.5" />
            <span>{t("campaign.statusSent")}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("campaign.searchLogsPlaceholder")}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
          >
            <option value="ALL">{t("campaign.filterAllStatus")}</option>
            <option value="READ">{t("campaign.statusRead")}</option>
            <option value="DELIVERED">{t("campaign.statusDelivered")}</option>
            <option value="FAILED">{t("campaign.statusFailed")}</option>
          </select>
        </div>
      </div>

      {/* Logs Virtualized Table */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground-muted select-none">
          <div className="col-span-4 sm:col-span-3">{t("campaign.tableHeaderRecipient")}</div>
          <div className="hidden sm:block sm:col-span-3">{t("campaign.tableHeaderCampaign")}</div>
          <div className="col-span-5 sm:col-span-4">{t("campaign.tableHeaderMessage")}</div>
          <div className="col-span-3 sm:col-span-2 text-right">{t("campaign.tableHeaderStatusTime")}</div>
        </div>

        <div
          ref={parentRef}
          className="max-h-120 overflow-auto divide-y divide-border/50 text-xs font-semibold"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const log = filteredLogs[virtualRow.index];
              return (
                <div
                  key={log.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="grid grid-cols-12 gap-3 px-5 py-3 items-center hover:bg-muted/40 transition-colors"
                >
                  {/* Recipient */}
                  <div className="col-span-4 sm:col-span-3 space-y-0.5">
                    <span className="font-bold text-foreground block truncate">
                      {log.recipientName || t("campaign.unnamedRecipient")}
                    </span>
                    <span className="text-[11px] text-foreground-muted font-mono block">
                      +{log.recipientPhone}
                    </span>
                  </div>

                  {/* Campaign */}
                  <div className="hidden sm:block sm:col-span-3 text-foreground-secondary truncate">
                    {log.campaignName}
                  </div>

                  {/* Message Snippet */}
                  <div className="col-span-5 sm:col-span-4 text-foreground-secondary truncate">
                    <span className="block truncate">{log.messageSnippet}</span>
                    {log.errorMessage && (
                      <span className="text-[10px] text-rose-500 block truncate font-mono">
                        {log.errorMessage}
                      </span>
                    )}
                  </div>

                  {/* Status & Time */}
                  <div className="col-span-3 sm:col-span-2 flex flex-col items-end justify-center space-y-0.5">
                    {renderStatusBadge(log.status)}
                    <span className="text-[10px] text-foreground-muted font-mono">
                      {new Date(log.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
