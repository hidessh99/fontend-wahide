"use client";

import React, { useState } from "react";
import {
  Send,
  Download,
  RefreshCw,
  Inbox,
  Check,
  CheckCheck,
  Clock,
  XCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { MessageLogResponse } from "@/modules/campaign/types/campaign.types";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { NativeSelect } from "@/components/ui/native-select";
import { DataTablePagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface MessageListTableProps {
  logs: MessageLogResponse[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  onNewMessage: () => void;
  onRefresh?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export function MessageListTable({
  logs,
  total,
  page,
  pageSize,
  isLoading,
  onPageChange,
  onNewMessage,
  onRefresh,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: MessageListTableProps) {
  const { t } = useI18n();
  const [internalSearch, setInternalSearch] = useState("");
  const [internalStatus, setInternalStatus] = useState<string>("ALL");

  const effectiveSearch =
    searchQuery !== undefined ? searchQuery : internalSearch;
  const effectiveStatus =
    statusFilter !== undefined ? statusFilter : internalStatus;

  const handleSearch = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  const handleStatus = (val: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(val);
    } else {
      setInternalStatus(val);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = [
      "ID",
      "Recipient",
      "Message",
      "Device",
      "Status",
      "Created At",
    ];
    const rows = logs.map((l) => [
      l.id,
      `"${l.recipient_jid || ""}"`,
      `"${(l.message_body || "").replace(/"/g, '""')}"`,
      l.device_id,
      l.status,
      l.created_at,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `whatsapp-messages-page-${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatusBadge = (status?: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "READ":
        return (
          <Badge variant="info">
            <CheckCheck className="size-3" />
            <span>READ</span>
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="success">
            <CheckCheck className="size-3" />
            <span>DELIVERED</span>
          </Badge>
        );
      case "SENT":
        return (
          <Badge variant="neutral">
            <Check className="size-3" />
            <span>SENT</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="danger">
            <XCircle className="size-3" />
            <span>FAILED</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="warning">
            <Clock className="size-3" />
            <span>{s || "PENDING"}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
      <div className="border-border flex flex-col justify-between gap-3 border-b p-3.5 sm:flex-row sm:items-center sm:p-4">
        <div className="w-full sm:max-w-xs md:max-w-sm">
          <SearchInput
            value={effectiveSearch}
            onChange={handleSearch}
            onSearch={handleSearch}
            onClear={() => handleSearch("")}
            placeholder={t("whatsapp.messagesSearchPlaceholder")}
            buttonText={t("common.search")}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NativeSelect
            value={effectiveStatus}
            onChange={(e) => handleStatus(e.target.value)}
            variant="pill"
            wrapperClassName="w-auto"
          >
            <option value="ALL">{t("whatsapp.messagesFilterAllStatus")}</option>
            <option value="SENT">SENT</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="READ">READ</option>
            <option value="FAILED">FAILED</option>
          </NativeSelect>

          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted h-10 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold"
              title={t("common.refresh")}
            >
              <RefreshCw
                className={cn("size-3.5", isLoading && "animate-spin")}
              />
              <span className="hidden sm:inline">{t("common.refresh")}</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="border-border hover:border-foreground-muted h-10 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold disabled:opacity-40"
          >
            <Download className="size-3.5" />
            <span>{t("whatsapp.messagesExport")}</span>
          </Button>

          <Button
            type="button"
            variant="primaryPill"
            size="sm"
            onClick={onNewMessage}
            className="h-10 cursor-pointer gap-1.5 px-4 text-xs font-bold shadow-xs"
          >
            <Send className="size-3.5" />
            <span>{t("whatsapp.messagesNewMessage")}</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 p-8 text-center sm:p-12">
          <Loader2 className="text-wise-green mx-auto size-8 animate-spin" />
          <p className="text-foreground-secondary text-xs font-semibold">
            {t("whatsapp.messagesLoadingList")}
          </p>
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={
            <Inbox className="size-10 text-foreground-muted stroke-[1.5]" />
          }
          title={t("whatsapp.messagesNoFound")}
          description={t("whatsapp.messagesNoFoundDesc")}
          action={
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={onNewMessage}
              className="gap-1.5 text-xs font-bold shadow-xs"
            >
              <Send className="size-3.5" />
              <span>{t("whatsapp.messagesSendFirst")}</span>
            </Button>
          }
        />
      ) : (
        <div>
          <div className="divide-border/50 divide-y lg:hidden">
            {logs.map((log) => {
              const phone = log.recipient_jid?.split("@")[0] || "-";
              const timeFormatted = log.created_at
                ? new Date(log.created_at).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-";

              return (
                <div
                  key={log.id}
                  className="bg-surface hover:bg-muted/30 p-3.5 sm:p-4 space-y-2.5 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-foreground truncate">
                      +{phone.replace(/^\+/, "")}
                    </span>
                    {renderStatusBadge(log.status)}
                  </div>

                  <div className="text-xs text-foreground/90">
                    {log.media_url && (
                      <span className="inline-flex items-center gap-1 mr-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground-secondary">
                        <FileText className="size-2.5" /> Media
                      </span>
                    )}
                    <span className="line-clamp-2">
                      {log.message_body || t("whatsapp.messagesAttachmentOnly")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-secondary pt-0.5 font-medium">
                    <span className="font-mono truncate max-w-35 bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                      {log.device_id
                        ? log.device_id.slice(0, 10) + "..."
                        : t("whatsapp.messagesDefaultDevice")}
                    </span>
                    <span className="whitespace-nowrap">{timeFormatted}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold text-foreground-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">
                    {t("whatsapp.messagesColRecipient")}
                  </th>
                  <th className="py-3 px-4">
                    {t("whatsapp.messagesColMessage")}
                  </th>
                  <th className="py-3 px-4">
                    {t("whatsapp.messagesColDevice")}
                  </th>
                  <th className="py-3 px-4">{t("whatsapp.messagesColTime")}</th>
                  <th className="py-3 px-4">
                    {t("whatsapp.messagesColStatus")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {logs.map((log) => {
                  const phone = log.recipient_jid?.split("@")[0] || "-";
                  const timeFormatted = log.created_at
                    ? new Date(log.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-foreground whitespace-nowrap">
                        <span>+{phone.replace(/^\+/, "")}</span>
                      </td>

                      <td className="py-3 px-4 max-w-xs sm:max-w-md truncate text-foreground/90">
                        {log.media_url && (
                          <span className="inline-flex items-center gap-1 mr-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground-secondary">
                            <FileText className="size-2.5" /> Media
                          </span>
                        )}
                        <span>
                          {log.message_body ||
                            t("whatsapp.messagesAttachmentOnly")}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-block max-w-30 truncate rounded bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-foreground-secondary border border-border/50">
                          {log.device_id
                            ? log.device_id.slice(0, 10) + "..."
                            : t("whatsapp.messagesDefaultDevice")}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-foreground-secondary whitespace-nowrap">
                        {timeFormatted}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
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

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={onPageChange}
        prevText={t("whatsapp.messagesPrev")}
        nextText={t("whatsapp.messagesNext")}
        entityName={t("whatsapp.messagesColMessage").toLowerCase()}
      />
    </div>
  );
}
