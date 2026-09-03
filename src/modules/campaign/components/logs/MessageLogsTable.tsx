"use client";

import React, { useState, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  CheckCheck,
  Check,
  AlertCircle,
  RefreshCw,
  Loader2,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { useI18n } from "@/lib/i18n/context";
import { useMessageLogs } from "../../hooks/useMessageLogs";
import { MessageDetailModal } from "./MessageDetailModal";

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
    setPageSize,
    isLoading,
    fetchLogs,
  } = useMessageLogs(1, 20);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<MessageLogItem | null>(null);
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
          <Badge variant="info">
            <CheckCheck className="size-3" />
            <span>{t("campaign.statusRead")}</span>
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="success">
            <CheckCheck className="size-3" />
            <span>{t("campaign.statusDelivered")}</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="danger">
            <AlertCircle className="size-3" />
            <span>{t("campaign.statusFailed")}</span>
          </Badge>
        );
      case "SENT":
      default:
        return (
          <Badge variant="neutral">
            <Check className="size-3" />
            <span>{t("campaign.statusSent")}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Form with Submit Button & Status Filter */}
      <div className="border-border bg-surface flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:p-4 dark:bg-[#161715]">
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          onSearch={() => {
            setActiveSearch(searchInput.trim());
            setPage(1);
          }}
          onClear={handleClearSearch}
          placeholder={t("campaign.searchLogsPlaceholder")}
        />

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
          <EmptyState
            icon={<AlertCircle />}
            title="Tidak ada log pesan ditemukan"
            description={
              activeSearch
                ? `Tidak ditemukan pesan dengan kata kunci "${activeSearch}".`
                : "Belum ada riwayat pengiriman pesan."
            }
          />
        ) : (
          <div>
            {/* Mobile View: Card-based Message Logs (Visible on < 768px) */}
            <div className="divide-border/50 divide-y md:hidden">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLogForDetail(log)}
                  className="bg-surface hover:bg-muted/30 cursor-pointer space-y-2.5 p-3.5 transition-colors sm:p-4 dark:bg-[#161715]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Phone className="size-3.5" />
                      </div>
                      <div className="min-w-0">
                        {log.recipientName && log.recipientName !== log.recipientPhone ? (
                          <>
                            <span className="text-foreground block truncate text-xs font-bold">
                              {log.recipientName}
                            </span>
                            <span className="text-foreground-secondary block font-mono text-[11px]">
                              +{log.recipientPhone}
                            </span>
                          </>
                        ) : (
                          <span className="text-foreground block truncate font-mono text-xs font-bold">
                            +{log.recipientPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center">
                      {renderStatusBadge(log.status)}
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
                    <span className="truncate font-medium">{log.campaignName}</span>
                    <span className="font-mono">
                      {log.sentAt
                        ? new Date(log.sentAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
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
                <div className="col-span-2">{t("campaign.tableHeaderCampaign")}</div>
                <div className="col-span-3">{t("campaign.tableHeaderMessage")}</div>
                <div className="col-span-2 text-center">{t("campaign.tableHeaderStatus")}</div>
                <div className="col-span-2 text-right">{t("campaign.tableHeaderSentAt")}</div>
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

                    const formattedDate = log.sentAt
                      ? new Date(log.sentAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-";

                    const formattedTime = log.sentAt
                      ? new Date(log.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "";

                    return (
                      <div
                        key={log.id}
                        onClick={() => setSelectedLogForDetail(log)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        className="hover:bg-muted/40 grid min-h-16 cursor-pointer grid-cols-12 items-center gap-3 px-5 py-3.5 transition-colors"
                      >
                        {/* Recipient */}
                        <div className="col-span-3 flex min-w-0 items-center gap-2.5">
                          <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Phone className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            {log.recipientName && log.recipientName !== log.recipientPhone ? (
                              <>
                                <span className="text-foreground block truncate text-xs font-bold sm:text-sm">
                                  {log.recipientName}
                                </span>
                                <span className="text-foreground-secondary block font-mono text-xs">
                                  +{log.recipientPhone}
                                </span>
                              </>
                            ) : (
                              <span className="text-foreground block truncate font-mono text-xs font-bold sm:text-sm">
                                +{log.recipientPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Campaign */}
                        <div className="col-span-2 truncate">
                          <span className="bg-muted/60 text-foreground-secondary inline-block max-w-full truncate rounded px-2 py-0.5 text-[11px] font-medium">
                            {log.campaignName}
                          </span>
                        </div>

                        {/* Message Snippet */}
                        <div className="text-foreground-secondary col-span-3 truncate text-xs leading-relaxed">
                          <span className="text-foreground-secondary block truncate">
                            {log.messageSnippet}
                          </span>
                          {log.errorMessage && (
                            <span className="mt-0.5 block truncate font-mono text-[11px] font-medium text-rose-500">
                              {log.errorMessage}
                            </span>
                          )}
                        </div>

                        {/* Status (Dedicated Column) */}
                        <div className="col-span-2 flex items-center justify-center">
                          {renderStatusBadge(log.status)}
                        </div>

                        {/* Sent At (Dedicated Column) */}
                        <div className="col-span-2 flex flex-col items-end justify-center space-y-0.5">
                          <span className="text-foreground text-xs font-semibold">
                            {formattedDate}
                          </span>
                          <span className="text-foreground-muted font-mono text-[11px]">
                            {formattedTime}
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
            {/* Left: Summary and Page Size Selector */}
            <div className="text-foreground-secondary flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span>
                {t("campaign.paginationShowing", {
                  start: String(startItem),
                  end: String(endItem),
                  total: String(total),
                }) || `Menampilkan ${startItem} - ${endItem} dari ${total} log pesan`}
              </span>

              <div className="border-border flex items-center gap-1.5 border-l pl-3">
                <span className="text-foreground-muted text-[11px]">
                  {t("campaign.rowsPerPage") || "Baris per halaman"}:
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-surface text-foreground border-border focus:border-wise-green h-7 cursor-pointer rounded-md border px-2 text-xs font-semibold outline-none dark:bg-[#10110e]"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Right: Always-Visible Interactive Pagination Controls */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(Math.max(1, page - 1))}
                className="border-border hover:border-foreground-muted h-8.5 cursor-pointer gap-1 rounded-full px-3.5 text-xs font-bold transition disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">{t("campaign.prevPage") || "Sebelumnya"}</span>
              </Button>

              <div className="bg-surface border-border text-foreground flex h-8.5 items-center rounded-full border px-3.5 text-xs font-bold select-none">
                <span>
                  {t("campaign.pageOf", {
                    page: String(page),
                    total: String(totalPages),
                  }) || `Halaman ${page} dari ${totalPages}`}
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className="border-border hover:border-foreground-muted h-8.5 cursor-pointer gap-1 rounded-full px-3.5 text-xs font-bold transition disabled:pointer-events-none disabled:opacity-40"
              >
                <span className="hidden sm:inline">{t("campaign.nextPage") || "Berikutnya"}</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Message Log Detail Modal */}
      {selectedLogForDetail && (
        <MessageDetailModal
          isOpen={Boolean(selectedLogForDetail)}
          log={selectedLogForDetail}
          onClose={() => setSelectedLogForDetail(null)}
        />
      )}
    </div>
  );
}
