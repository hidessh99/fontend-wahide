"use client";

import React, { useState, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Search,
  X,
  CheckCheck,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { useMessageLogs } from "../../hooks/useMessageLogs";

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

export function MessageLogsTable() {
  const { t } = useI18n();
  const {
    logs,
    total: serverTotal,
    page,
    setPage,
    pageSize,
    isLoading,
    fetchLogs,
  } = useMessageLogs(1, 20);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const parentRef = useRef<HTMLDivElement>(null);

  const mappedLogs = useMemo<MessageLogItem[]>(() => {
    return logs.map((m) => {
      const cleanPhone = m.recipient_jid.replace(/@s\.whatsapp\.net$/, "");
      return {
        id: m.id,
        campaignName: m.campaign_id
          ? `Kampanye #${m.campaign_id.slice(-6)}`
          : "Pesan Instan / Direct",
        recipientPhone: cleanPhone,
        recipientName: cleanPhone,
        messageSnippet: m.message_body,
        status: m.status,
        sentAt: m.sent_at || m.created_at,
        errorMessage: m.error_message,
      };
    });
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return mappedLogs.filter((l) => {
      const matchSearch =
        activeSearch === "" ||
        l.recipientPhone.includes(activeSearch) ||
        (l.recipientName && l.recipientName.toLowerCase().includes(activeSearch.toLowerCase())) ||
        l.campaignName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        l.messageSnippet.toLowerCase().includes(activeSearch.toLowerCase());

      const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [mappedLogs, activeSearch, statusFilter]);

  const total = serverTotal || filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // High-Throughput DOM Virtualization
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  const renderStatusBadge = (status: MessageLogItem["status"]) => {
    switch (status) {
      case "READ":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-500">
            <CheckCheck className="size-3.5" />
            <span>{t("campaign.statusRead")}</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCheck className="size-3.5" />
            <span>{t("campaign.statusDelivered")}</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertCircle className="size-3.5" />
            <span>{t("campaign.statusFailed")}</span>
          </span>
        );
      case "SENT":
      default:
        return (
          <span className="text-foreground-muted inline-flex items-center gap-1 text-xs font-bold">
            <Check className="size-3.5" />
            <span>{t("campaign.statusSent")}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Form with Submit Button & Status Filter */}
      <div className="border-border bg-surface flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:p-4 dark:bg-[#161715]">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("campaign.searchLogsPlaceholder")}
              className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-10 w-full rounded-full border pr-9 pl-10 text-xs font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
            />
            {(searchInput || activeSearch) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-foreground-muted hover:text-foreground hover:bg-muted absolute top-1/2 right-3 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition"
                title="Hapus Pencarian"
                aria-label="Hapus Pencarian"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            className="h-10 shrink-0 cursor-pointer px-4 text-xs font-bold shadow-xs"
          >
            <Search className="mr-1 size-3.5" />
            <span>Cari</span>
          </Button>
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchLogs()}
            disabled={isLoading}
            className="border-border hover:border-foreground-muted h-10 cursor-pointer gap-1 rounded-full px-3 text-xs font-bold"
            title="Refresh Log"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-surface text-foreground border-border focus:border-wise-green h-10 w-full cursor-pointer rounded-full border px-3.5 text-xs font-semibold outline-none sm:w-auto dark:bg-[#10110e]"
          >
            <option value="ALL">{t("campaign.filterAllStatus")}</option>
            <option value="READ">{t("campaign.statusRead")}</option>
            <option value="DELIVERED">{t("campaign.statusDelivered")}</option>
            <option value="FAILED">{t("campaign.statusFailed")}</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="border-border bg-surface overflow-hidden rounded-md border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="space-y-3 p-8 text-center sm:p-12">
            <Loader2 className="text-wise-green mx-auto size-8 animate-spin" />
            <p className="text-foreground-secondary text-xs font-semibold">
              Memuat log pesan dari server...
            </p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="space-y-2 p-6 text-center sm:p-10">
            <AlertCircle className="text-foreground-muted mx-auto size-10" />
            <h3 className="text-foreground text-sm font-bold">Tidak ada log pesan ditemukan</h3>
            <p className="text-foreground-secondary text-xs">
              {activeSearch
                ? `Tidak ditemukan pesan dengan kata kunci "${activeSearch}".`
                : "Belum ada riwayat pengiriman pesan."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Card-based Message Logs (Visible on < 768px) */}
            <div className="divide-border/50 divide-y md:hidden">
              {filteredLogs.map((log) => (
                <div key={log.id} className="bg-surface space-y-2 p-3.5 sm:p-4 dark:bg-[#161715]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-foreground block truncate text-sm font-bold">
                        {log.recipientName || t("campaign.unnamedRecipient")}
                      </span>
                      <span className="text-foreground-secondary block font-mono text-xs">
                        +{log.recipientPhone}
                      </span>
                    </div>

                    <div className="flex shrink-0 flex-col items-end">
                      {renderStatusBadge(log.status)}
                      <span className="text-foreground-muted mt-0.5 font-mono text-[11px]">
                        {new Date(log.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/40 text-foreground-secondary rounded p-2 text-xs">
                    <p className="line-clamp-2">{log.messageSnippet}</p>
                    {log.errorMessage && (
                      <span className="mt-1 block truncate font-mono text-xs text-rose-500">
                        {log.errorMessage}
                      </span>
                    )}
                  </div>

                  <div className="text-foreground-muted flex items-center justify-between text-[11px]">
                    <span className="truncate">{log.campaignName}</span>
                    <span className="font-mono">
                      {new Date(log.sentAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Tabular Virtualized Grid (Visible on >= 768px) */}
            <div className="hidden md:block">
              {/* Table Header */}
              <div className="bg-muted/60 border-border text-foreground-muted grid grid-cols-12 gap-3 border-b px-5 py-4 text-xs font-extrabold tracking-wider uppercase select-none">
                <div className="col-span-3">{t("campaign.tableHeaderRecipient")}</div>
                <div className="col-span-3">{t("campaign.tableHeaderCampaign")}</div>
                <div className="col-span-4">{t("campaign.tableHeaderMessage")}</div>
                <div className="col-span-2 text-right">{t("campaign.tableHeaderStatusTime")}</div>
              </div>

              {/* Table Body */}
              <div
                ref={parentRef}
                className="divide-border/50 max-h-135 divide-y overflow-auto text-xs font-semibold"
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
                    if (!log) return null;

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
                        className="hover:bg-muted/40 grid min-h-14.5 grid-cols-12 items-center gap-3 px-5 py-3.5 transition-colors"
                      >
                        {/* Recipient */}
                        <div className="col-span-3 space-y-0.5">
                          <span className="text-foreground block truncate text-sm font-bold sm:text-base">
                            {log.recipientName || t("campaign.unnamedRecipient")}
                          </span>
                          <span className="text-foreground-secondary block font-mono text-xs sm:text-sm">
                            +{log.recipientPhone}
                          </span>
                        </div>

                        {/* Campaign */}
                        <div className="text-foreground-secondary col-span-3 truncate text-sm font-semibold">
                          {log.campaignName}
                        </div>

                        {/* Message Snippet */}
                        <div className="text-foreground-secondary col-span-4 truncate text-xs sm:text-sm">
                          <span className="block truncate">{log.messageSnippet}</span>
                          {log.errorMessage && (
                            <span className="mt-0.5 block truncate font-mono text-xs text-rose-500">
                              {log.errorMessage}
                            </span>
                          )}
                        </div>

                        {/* Status & Time */}
                        <div className="col-span-2 flex flex-col items-end justify-center space-y-0.5">
                          {renderStatusBadge(log.status)}
                          <span className="text-foreground-muted font-mono text-xs">
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
        )}

        {/* Pagination Footer */}
        {total > 0 && (
          <div className="border-border bg-muted/30 flex flex-col items-center justify-between gap-3 border-t p-3 sm:flex-row sm:px-5 sm:py-3.5">
            {/* Item count summary */}
            <div className="text-foreground-secondary text-xs font-semibold">
              Menampilkan {startItem} - {endItem} dari {total} log pesan
            </div>

            {/* Page navigation: Previous, Page Indicator, Next */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-foreground-muted px-1.5 text-xs font-bold select-none">
                  Halaman {page} dari {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="border-border hover:border-foreground-muted h-8.5 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Sebelumnya</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="border-border hover:border-foreground-muted h-8.5 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold disabled:opacity-40"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
