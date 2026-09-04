"use client";

import React, { useState, useMemo } from "react";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useTableSort } from "@/hooks/useTableSort";

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

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<MessageLogItem>({
    initialKey: "sentAt",
    initialOrder: "desc",
  });

  const sortedFilteredLogs = useMemo(() => {
    return sortData(filteredLogs);
  }, [filteredLogs, sortData]);

  const total = serverTotal || sortedFilteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
            {/* Mobile View: Card-based Message Logs (Visible on < 1024px) */}
            <div className="divide-border/50 divide-y lg:hidden">
              {sortedFilteredLogs.map((log) => (
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
                    <p className="line-clamp-2 leading-relaxed">{log.messageSnippet}</p>
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

            {/* Desktop View: Unified Responsive Table using shadcn/ui (Visible on >= 1024px) */}
            <div className="hidden lg:block">
              <Table className="min-w-[860px]">
                <TableHeader>
                  <TableRow className="bg-muted/50 border-border hover:bg-muted/50">
                    <TableHead className="w-[22%] px-5 py-3.5">
                      <DataTableColumnHeader
                        title={t("campaign.tableHeaderRecipient")}
                        columnKey="recipientPhone"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[18%] px-4 py-3.5">
                      <DataTableColumnHeader
                        title={t("campaign.tableHeaderCampaign")}
                        columnKey="campaignName"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[28%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("campaign.tableHeaderMessage")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[14%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title={t("campaign.tableHeaderStatus")}
                        columnKey="status"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[18%] px-5 py-3.5 text-right">
                      <DataTableColumnHeader
                        title={t("campaign.tableHeaderSentAt")}
                        columnKey="sentAt"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFilteredLogs.map((log) => {
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
                      <TableRow
                        key={log.id}
                        onClick={() => setSelectedLogForDetail(log)}
                        className="hover:bg-muted/40 border-border/40 cursor-pointer border-b transition-colors"
                      >
                        {/* Recipient */}
                        <TableCell className="px-5 py-3.5 align-middle">
                          <div className="flex min-w-0 items-center gap-2.5">
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
                        </TableCell>

                        {/* Campaign */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <span className="bg-muted/60 text-foreground-secondary inline-block max-w-full truncate rounded px-2 py-0.5 text-[11px] font-medium">
                            {log.campaignName}
                          </span>
                        </TableCell>

                        {/* Message Snippet */}
                        <TableCell className="text-foreground-secondary px-4 py-3.5 align-middle text-xs leading-relaxed">
                          <span className="block max-w-xs truncate">{log.messageSnippet}</span>
                          {log.errorMessage && (
                            <span className="mt-0.5 block truncate font-mono text-[11px] font-medium text-rose-500">
                              {log.errorMessage}
                            </span>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            {renderStatusBadge(log.status)}
                          </div>
                        </TableCell>

                        {/* Sent At */}
                        <TableCell className="px-5 py-3.5 text-right align-middle font-mono text-xs">
                          <div className="space-y-0.5">
                            <span className="text-foreground block font-bold whitespace-nowrap">
                              {formattedDate}
                            </span>
                            <span className="text-foreground-muted block text-[11px] whitespace-nowrap">
                              {formattedTime}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
