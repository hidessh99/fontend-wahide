"use client";

import React, { useState, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search, X, CheckCheck, Check, AlertCircle, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
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
  const { logs, total: serverTotal, page, setPage, pageSize, isLoading, fetchLogs } = useMessageLogs(1, 20);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const parentRef = useRef<HTMLDivElement>(null);

  const mappedLogs = useMemo<MessageLogItem[]>(() => {
    return logs.map((m) => {
      const cleanPhone = m.recipient_jid.replace(/@s\.whatsapp\.net$/, "");
      return {
        id: m.id,
        campaignName: m.campaign_id ? `Kampanye #${m.campaign_id.slice(-6)}` : "Pesan Instan / Direct",
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
          <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground-muted">
            <Check className="size-3.5" />
            <span>{t("campaign.statusSent")}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Form with Submit Button & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("campaign.searchLogsPlaceholder")}
              className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            />
            {(searchInput || activeSearch) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
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
            className="h-10 px-4 text-xs font-bold shadow-xs shrink-0 cursor-pointer"
          >
            <Search className="size-3.5 mr-1" />
            <span>Cari</span>
          </Button>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchLogs()}
            disabled={isLoading}
            className="h-10 px-3 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer"
            title="Refresh Log"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full sm:w-auto h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green cursor-pointer"
          >
            <option value="ALL">{t("campaign.filterAllStatus")}</option>
            <option value="READ">{t("campaign.statusRead")}</option>
            <option value="DELIVERED">{t("campaign.statusDelivered")}</option>
            <option value="FAILED">{t("campaign.statusFailed")}</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-8 sm:p-12 text-center space-y-3">
            <Loader2 className="size-8 text-wise-green animate-spin mx-auto" />
            <p className="text-xs font-semibold text-foreground-secondary">Memuat log pesan dari server...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-6 sm:p-10 text-center space-y-2">
            <AlertCircle className="size-10 text-foreground-muted mx-auto" />
            <h3 className="font-bold text-sm text-foreground">Tidak ada log pesan ditemukan</h3>
            <p className="text-xs text-foreground-secondary">
              {activeSearch
                ? `Tidak ditemukan pesan dengan kata kunci "${activeSearch}".`
                : "Belum ada riwayat pengiriman pesan."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Card-based Message Logs (Visible on < 768px) */}
            <div className="md:hidden divide-y divide-border/50">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-3.5 sm:p-4 space-y-2 bg-surface dark:bg-[#161715]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-foreground block truncate">
                        {log.recipientName || t("campaign.unnamedRecipient")}
                      </span>
                      <span className="text-xs text-foreground-secondary font-mono block">
                        +{log.recipientPhone}
                      </span>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      {renderStatusBadge(log.status)}
                      <span className="text-[11px] text-foreground-muted font-mono mt-0.5">
                        {new Date(log.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-muted/40 text-xs text-foreground-secondary">
                    <p className="line-clamp-2">{log.messageSnippet}</p>
                    {log.errorMessage && (
                      <span className="text-xs text-rose-500 block truncate font-mono mt-1">
                        {log.errorMessage}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-muted">
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
              <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                <div className="col-span-3">{t("campaign.tableHeaderRecipient")}</div>
                <div className="col-span-3">{t("campaign.tableHeaderCampaign")}</div>
                <div className="col-span-4">{t("campaign.tableHeaderMessage")}</div>
                <div className="col-span-2 text-right">{t("campaign.tableHeaderStatusTime")}</div>
              </div>

              {/* Table Body */}
              <div
                ref={parentRef}
                className="max-h-135 overflow-auto divide-y divide-border/50 text-xs font-semibold"
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
                        className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors min-h-14.5"
                      >
                        {/* Recipient */}
                        <div className="col-span-3 space-y-0.5">
                          <span className="font-bold text-sm sm:text-base text-foreground block truncate">
                            {log.recipientName || t("campaign.unnamedRecipient")}
                          </span>
                          <span className="text-xs sm:text-sm text-foreground-secondary font-mono block">
                            +{log.recipientPhone}
                          </span>
                        </div>

                        {/* Campaign */}
                        <div className="col-span-3 text-sm font-semibold text-foreground-secondary truncate">
                          {log.campaignName}
                        </div>

                        {/* Message Snippet */}
                        <div className="col-span-4 text-xs sm:text-sm text-foreground-secondary truncate">
                          <span className="block truncate">{log.messageSnippet}</span>
                          {log.errorMessage && (
                            <span className="text-xs text-rose-500 block truncate font-mono mt-0.5">
                              {log.errorMessage}
                            </span>
                          )}
                        </div>

                        {/* Status & Time */}
                        <div className="col-span-2 flex flex-col items-end justify-center space-y-0.5">
                          {renderStatusBadge(log.status)}
                          <span className="text-xs text-foreground-muted font-mono">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 border-t border-border bg-muted/30">
            {/* Item count summary */}
            <div className="text-xs font-semibold text-foreground-secondary">
              Menampilkan {startItem} - {endItem} dari {total} log pesan
            </div>

            {/* Page navigation: Previous, Page Indicator, Next */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground-muted px-1.5 select-none">
                  Halaman {page} dari {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Sebelumnya</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
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
