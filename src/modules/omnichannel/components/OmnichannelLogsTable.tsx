"use client";

import React from "react";
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
  Smartphone,
  Building2,
  Bot,
  AlertTriangle,
} from "lucide-react";
import {
  UnifiedMessageLog,
  OmnichannelChannelType,
  OmnichannelActiveCounts,
} from "../types/omnichannel.types";
import { ChannelSwitcherPills } from "./ChannelSwitcherPills";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { NativeSelect } from "@/components/ui/native-select";
import { DataTablePagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { formatDisplayPhone } from "@/lib/phone";

interface OmnichannelLogsTableProps {
  logs: UnifiedMessageLog[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  channelFilter: "ALL" | OmnichannelChannelType;
  onChannelFilterChange: (ch: "ALL" | OmnichannelChannelType) => void;
  activeCounts?: OmnichannelActiveCounts;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPageChange: (newPage: number) => void;
  onNewMessage: () => void;
  onRefresh?: () => void;
}

export function OmnichannelLogsTable({
  logs,
  total,
  page,
  pageSize,
  isLoading,
  channelFilter,
  onChannelFilterChange,
  activeCounts,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  onPageChange,
  onNewMessage,
  onRefresh,
}: OmnichannelLogsTableProps) {
  const { t } = useI18n();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = [
      "ID",
      "Saluran",
      "Pengirim",
      "Penerima",
      "Arah",
      "Pesan",
      "Status",
      "Waktu",
    ];
    const rows = logs.map((l) => [
      l.id,
      l.channelType,
      `"${l.senderName} (${l.senderIdentifier})"`,
      `"${l.recipient}"`,
      l.direction,
      `"${(l.messageBody || "").replace(/"/g, '""')}"`,
      l.status,
      l.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `omnichannel_messages_${channelFilter.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border-border bg-surface overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xs">
      {/* Top Header & Channel Switcher */}
      <div className="border-border/80 border-b p-4 sm:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {t("whatsapp.messagesListTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-foreground-secondary font-medium">
              {t("omnichannel.messages.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-9 px-3 text-xs font-bold rounded-full cursor-pointer gap-1.5"
              >
                <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
                <span className="hidden sm:inline">{t("common.refresh")}</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={logs.length === 0 || isLoading}
              className="h-9 px-3 text-xs font-bold rounded-full cursor-pointer gap-1.5"
            >
              <Download className="size-3.5" />
              <span>{t("whatsapp.messagesExport")} CSV</span>
            </Button>

            <Button
              variant="primaryPill"
              size="sm"
              onClick={onNewMessage}
              className="h-9 px-4 text-xs font-bold shadow-xs cursor-pointer gap-1.5"
            >
              <Send className="size-3.5" />
              <span>{t("whatsapp.messagesNewMessage")}</span>
            </Button>
          </div>
        </div>

        {/* Channel Filter Switcher Pills */}
        <div className="pt-1">
          <ChannelSwitcherPills
            selectedChannel={channelFilter}
            onSelectChannel={onChannelFilterChange}
            includeAllOption={true}
            counts={activeCounts}
            size="sm"
          />
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={(val) => onSearchChange(val)}
              onSearch={(val) => onSearchChange(val)}
              onClear={() => onSearchChange("")}
              placeholder={t("whatsapp.messagesSearchPlaceholder")}
              className="h-10 text-xs sm:text-sm rounded-full"
            />
          </div>

          <div className="w-full sm:w-48">
            <NativeSelect
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              variant="rounded"
              className="h-10 text-xs font-semibold"
            >
              <option value="ALL">{t("whatsapp.messagesFilterAllStatus")}</option>
              <option value="SENT">Terkirim (Sent)</option>
              <option value="DELIVERED">Diterima (Delivered)</option>
              <option value="READ">Dibaca (Read)</option>
              <option value="FAILED">Gagal (Failed)</option>
              <option value="QUEUED">Antrean (Queued)</option>
            </NativeSelect>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/70 bg-muted/40 text-[10px] sm:text-xs font-black uppercase tracking-wider text-foreground-secondary">
              <th className="py-3 px-4 sm:px-6">{t("whatsapp.messagesColDevice")}</th>
              <th className="py-3 px-4 sm:px-6">{t("whatsapp.messagesColRecipient")}</th>
              <th className="py-3 px-4 sm:px-6">{t("omnichannel.composer.selectSender")}</th>
              <th className="py-3 px-4 sm:px-6 min-w-[200px]">{t("whatsapp.messagesColMessage")}</th>
              <th className="py-3 px-4 sm:px-6">{t("whatsapp.messagesColTime")}</th>
              <th className="py-3 px-4 sm:px-6 text-right">{t("whatsapp.messagesColStatus")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs sm:text-sm font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-foreground-secondary">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-wise-green" />
                    <span className="text-xs font-semibold">Memuat riwayat pesan...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12">
                  <EmptyState
                    icon={<Inbox className="size-10" />}
                    title="Tidak ada pesan ditemukan"
                    description="Belum ada riwayat pesan yang sesuai dengan filter pencarian Anda."
                    action={
                      <Button
                        variant="primaryPill"
                        size="sm"
                        onClick={onNewMessage}
                        className="mt-2 text-xs font-bold"
                      >
                        Kirim Pesan Pertama
                      </Button>
                    }
                  />
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const formattedTime = new Date(log.createdAt).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Channel */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      {log.channelType === "WHATSMEOW_UNOFFICIAL" && (
                        <Badge
                          variant="outline"
                          className="gap-1 text-[10px] font-bold border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10"
                        >
                          <Smartphone className="size-3" />
                          <span>WA Web</span>
                        </Badge>
                      )}
                      {log.channelType === "META_WABA_OFFICIAL" && (
                        <Badge
                          variant="outline"
                          className="gap-1 text-[10px] font-bold border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-500/10"
                        >
                          <Building2 className="size-3" />
                          <span>Meta WABA</span>
                        </Badge>
                      )}
                      {log.channelType === "TELEGRAM_BOT" && (
                        <Badge
                          variant="outline"
                          className="gap-1 text-[10px] font-bold border-sky-500/30 text-sky-700 dark:text-sky-400 bg-sky-500/10"
                        >
                          <Bot className="size-3" />
                          <span>Telegram</span>
                        </Badge>
                      )}
                    </td>

                    {/* Recipient */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <div className="font-semibold text-foreground">
                        {log.channelType === "TELEGRAM_BOT"
                          ? log.recipient.startsWith("@")
                            ? log.recipient
                            : `ID: ${log.recipient}`
                          : formatDisplayPhone(log.recipient)}
                      </div>
                    </td>

                    {/* Sender */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <div className="text-xs text-foreground-secondary font-medium">
                        {log.senderName}
                      </div>
                    </td>

                    {/* Message Body */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="line-clamp-2 max-w-sm text-xs leading-relaxed text-foreground">
                        {log.messageBody || (
                          <span className="italic text-muted-foreground">
                            (Hanya lampiran media)
                          </span>
                        )}
                      </div>
                      {log.mediaUrl && (
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                          <FileText className="size-2.5" />
                          <span className="truncate max-w-[160px]">Lampiran Tersemat</span>
                        </div>
                      )}
                      {log.errorMessage && (
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-rose-600 dark:text-rose-400">
                          <AlertTriangle className="size-3 shrink-0" />
                          <span className="truncate">{log.errorMessage}</span>
                        </div>
                      )}
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-xs text-foreground-secondary">
                      {formattedTime}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">
                      {log.status === "READ" && (
                        <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20 text-[10px] font-bold gap-1">
                          <CheckCheck className="size-3 text-sky-500" />
                          <span>READ</span>
                        </Badge>
                      )}
                      {log.status === "DELIVERED" && (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[10px] font-bold gap-1">
                          <CheckCheck className="size-3 text-emerald-500" />
                          <span>DELIVERED</span>
                        </Badge>
                      )}
                      {log.status === "SENT" && (
                        <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20 text-[10px] font-bold gap-1">
                          <Check className="size-3 text-purple-500" />
                          <span>SENT</span>
                        </Badge>
                      )}
                      {log.status === "QUEUED" && (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[10px] font-bold gap-1">
                          <Clock className="size-3 text-amber-500" />
                          <span>QUEUED</span>
                        </Badge>
                      )}
                      {log.status === "FAILED" && (
                        <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20 text-[10px] font-bold gap-1">
                          <XCircle className="size-3 text-rose-500" />
                          <span>FAILED</span>
                        </Badge>
                      )}
                      {log.status === "PENDING" && (
                        <Badge className="bg-muted text-foreground-secondary text-[10px] font-bold gap-1">
                          <Clock className="size-3" />
                          <span>PENDING</span>
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && logs.length > 0 && (
        <div className="border-t border-border/80 p-4">
          <DataTablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPageChange={onPageChange}
            entityName="pesan"
          />
        </div>
      )}
    </div>
  );
}
