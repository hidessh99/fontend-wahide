"use client";

import React, { useState } from "react";
import {
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { NativeSelect } from "@/components/ui/native-select";
import { DataTablePagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty";
import { useI18n } from "@/lib/i18n/context";
import {
  TelegramMessage,
  TelegramMessageDirection,
  TelegramMessageStatus,
} from "../../types/telegram.types";
import { TelegramMessageDetailDialog } from "./TelegramMessageDetailDialog";

const idDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatLogTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "-" : idDateFormatter.format(d);
};

interface TelegramLogsTableProps {
  logs: TelegramMessage[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  directionFilter: "ALL" | TelegramMessageDirection;
  onDirectionFilterChange: (dir: "ALL" | TelegramMessageDirection) => void;
  statusFilter: "ALL" | TelegramMessageStatus;
  onStatusFilterChange: (status: "ALL" | TelegramMessageStatus) => void;
  onPageChange: (p: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export function TelegramLogsTable({
  logs,
  total,
  page,
  pageSize,
  isLoading,
  searchQuery,
  onSearchChange,
  directionFilter,
  onDirectionFilterChange,
  statusFilter,
  onStatusFilterChange,
  onPageChange,
  onPageSizeChange,
}: TelegramLogsTableProps) {
  const { t } = useI18n();
  const [draftSearch, setDraftSearch] = useState(searchQuery ?? "");
  const [selectedLog, setSelectedLog] = useState<TelegramMessage | null>(null);

  // Synchronize draftSearch if external searchQuery changes
  React.useEffect(() => {
    if (searchQuery !== undefined) {
      setDraftSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (val: string) => {
    onSearchChange(val.trim());
  };

  const handleSearchClear = () => {
    setDraftSearch("");
    onSearchChange("");
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const escapeCell = (val: unknown) =>
      `"${String(val ?? "").replace(/"/g, '""')}"`;

    const headers = [
      "ID",
      "Direction",
      "Chat ID",
      "Bot ID",
      "Type",
      "Message",
      "Media URL",
      "Status",
      "Error Reason",
      "Sent At",
      "Created At",
    ];

    const rows = logs.map((l) => [
      escapeCell(l.id),
      escapeCell(l.direction),
      escapeCell(l.chat_id),
      escapeCell(l.bot_id),
      escapeCell(l.message_type),
      escapeCell(l.text || ""),
      escapeCell(l.media_url || ""),
      escapeCell(l.status),
      escapeCell(l.error_reason || ""),
      escapeCell(l.sent_at || ""),
      escapeCell(l.created_at),
    ]);

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `telegram-messages-page-${page}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Free memory immediately
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  };

  const renderStatusBadge = (status?: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "DELIVERED":
      case "SENT":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            <span>{t("telegram.logs.statusDeliveredBadge")}</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="danger" className="gap-1">
            <AlertCircle className="size-3" />
            <span>{t("telegram.logs.statusFailedBadge")}</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="size-3" />
            <span>{s || t("telegram.logs.statusQueuedBadge")}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
      {/* Toolbar Bar */}
      <div className="border-border flex flex-col justify-between gap-3 border-b p-3.5 sm:flex-row sm:items-center sm:p-4">
        <div className="w-full sm:max-w-xs md:max-w-sm">
          <SearchInput
            value={draftSearch}
            onChange={setDraftSearch}
            onSearch={handleSearchSubmit}
            onClear={handleSearchClear}
            placeholder={t("telegram.logs.searchPlaceholder")}
            buttonText={t("common.search")}
            hideSubmitButton={false}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direction Filter */}
          <NativeSelect
            value={directionFilter}
            onChange={(e) =>
              onDirectionFilterChange(
                e.target.value as "ALL" | TelegramMessageDirection,
              )
            }
            variant="pill"
            wrapperClassName="w-auto"
          >
            <option value="ALL">{t("telegram.logs.directionAll")}</option>
            <option value="OUTBOUND">{t("telegram.logs.directionOutBot")}</option>
            <option value="INBOUND">{t("telegram.logs.directionInUser")}</option>
          </NativeSelect>

          {/* Status Filter */}
          <NativeSelect
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(
                e.target.value as "ALL" | TelegramMessageStatus,
              )
            }
            variant="pill"
            wrapperClassName="w-auto"
          >
            <option value="ALL">{t("telegram.logs.statusAll")}</option>
            <option value="DELIVERED">{t("telegram.logs.statusDelivered")}</option>
            <option value="FAILED">{t("telegram.logs.statusFailed")}</option>
            <option value="QUEUED">{t("telegram.logs.statusQueued")}</option>
          </NativeSelect>

          {/* Export CSV */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="border-border hover:border-foreground-muted h-10 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold disabled:opacity-40"
          >
            <Download className="size-3.5" />
            <span>{t("telegram.logs.exportCsv")}</span>
          </Button>
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <div className="space-y-3 p-8 text-center sm:p-12">
          <Loader2 className="text-sky-500 mx-auto size-8 animate-spin" />
          <p className="text-foreground-secondary text-xs font-semibold">
            {t("telegram.logs.loading")}
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={<MessageSquare className="size-10" />}
            title={t("telegram.logs.empty")}
            description={t("telegram.logs.emptyDesc")}
          />
        </div>
      ) : (
        <div>
          {/* Mobile Card List (lg:hidden) */}
          <div className="divide-border/50 divide-y lg:hidden">
            {logs.map((log) => {
              const isOutbound = log.direction === "OUTBOUND";
              const timeFormatted = formatLogTime(log.sent_at || log.created_at);

              return (
                <div
                  key={log.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedLog(log)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedLog(log);
                    }
                  }}
                  className="bg-surface hover:bg-muted/40 cursor-pointer active:scale-[0.99] p-3.5 sm:p-4 space-y-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground truncate">
                      {isOutbound ? (
                        <ArrowUpRight className="size-3.5 text-sky-500 shrink-0" />
                      ) : (
                        <ArrowDownLeft className="size-3.5 text-emerald-500 shrink-0" />
                      )}
                      <span>Chat ID: {log.chat_id}</span>
                    </div>
                    {renderStatusBadge(log.status)}
                  </div>

                  <div className="text-xs text-foreground/90">
                    {log.media_url && (
                      <span className="inline-flex items-center gap-1 mr-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground-secondary">
                        <FileText className="size-2.5" /> {t("telegram.logs.mediaLabel")}
                      </span>
                    )}
                    <span className="line-clamp-2">
                      {log.text || t("telegram.logs.mediaAttachmentFallback")}
                    </span>
                    {log.error_reason && (
                      <p className="text-[11px] text-rose-500 font-semibold truncate pt-1">
                        Error: {log.error_reason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-secondary pt-0.5 font-medium">
                    <span className="font-mono text-[10px] bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                      {log.message_type}
                    </span>
                    <span className="whitespace-nowrap">{timeFormatted}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (hidden lg:block) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold text-foreground-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">{t("telegram.logs.colDirection")}</th>
                  <th className="py-3 px-4">{t("telegram.logs.colChatIdHeader")}</th>
                  <th className="py-3 px-4">{t("telegram.logs.colType")}</th>
                  <th className="py-3 px-4">{t("telegram.logs.colContent")}</th>
                  <th className="py-3 px-4">{t("telegram.logs.colTimeHeader")}</th>
                  <th className="py-3 px-4 text-right">{t("telegram.logs.colStatusHeader")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {logs.map((log) => {
                  const isOutbound = log.direction === "OUTBOUND";
                  const timeFormatted = formatLogTime(
                    log.sent_at || log.created_at,
                  );

                  return (
                    <tr
                      key={log.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedLog(log)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedLog(log);
                        }
                      }}
                      className="hover:bg-muted/40 cursor-pointer transition-colors outline-none focus-visible:bg-muted/50"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isOutbound ? (
                            <ArrowUpRight className="size-3.5 text-sky-500" />
                          ) : (
                            <ArrowDownLeft className="size-3.5 text-emerald-500" />
                          )}
                          <span className="font-semibold text-[11px] text-foreground">
                            {isOutbound ? t("telegram.logs.directionOut") : t("telegram.logs.directionIn")}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-foreground whitespace-nowrap">
                        {log.chat_id}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono"
                        >
                          {log.message_type}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 max-w-xs sm:max-w-md truncate text-foreground/90">
                        {log.media_url && (
                          <span className="inline-flex items-center gap-1 mr-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground-secondary">
                            <FileText className="size-2.5" /> {t("telegram.logs.mediaLabel")}
                          </span>
                        )}
                        <span>{log.text || "-"}</span>
                        {log.error_reason && (
                          <span className="text-[10px] text-rose-500 font-semibold block truncate">
                            Error: {log.error_reason}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-foreground-secondary whitespace-nowrap">
                        {timeFormatted}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {renderStatusBadge(log.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Standardized DataTablePagination */}
      <DataTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 30, 50]}
        prevText={t("telegram.logs.prevText")}
        nextText={t("telegram.logs.nextText")}
        entityName={t("telegram.logs.entityName")}
      />

      {/* Message Detail Modal */}
      <TelegramMessageDetailDialog
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
