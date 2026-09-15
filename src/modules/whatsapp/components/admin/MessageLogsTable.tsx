"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { AdminMessageLogItem } from "@/modules/whatsapp/types/admin.types";
import { useI18n } from "@/lib/i18n/context";

const DeleteMessageModal = dynamic(
  () => import("./DeleteMessageModal").then((m) => m.DeleteMessageModal),
  { ssr: false },
);
const MessageDetailModal = dynamic(
  () => import("./MessageDetailModal").then((m) => m.MessageDetailModal),
  { ssr: false },
);
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { NativeSelect } from "@/components/ui/native-select";
import {
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  Loader2,
  Send,
  Paperclip,
  CheckCheck,
} from "lucide-react";
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

interface MessageLogsTableProps {
  logs: AdminMessageLogItem[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  directionFilter: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onRefresh: () => void;
  onDelete: (id: string) => Promise<unknown>;
  onSearch: (q: string) => void;
  onClearSearch: () => void;
  onStatusFilterChange: (status: string) => void;
  onDirectionFilterChange: (dir: string) => void;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function MessageLogsTable({
  logs,
  isLoading,
  searchQuery,
  statusFilter,
  directionFilter,
  page,
  pageSize,
  total,
  totalPages,
  onRefresh,
  onDelete,
  onSearch,
  onClearSearch,
  onStatusFilterChange,
  onDirectionFilterChange,
  onPageChange,
  onPageSizeChange,
  onNextPage,
  onPrevPage,
}: MessageLogsTableProps) {
  const { t, locale } = useI18n();

  const [selectedMessageForDelete, setSelectedMessageForDelete] =
    useState<AdminMessageLogItem | null>(null);
  const [selectedMessageForDetail, setSelectedMessageForDetail] =
    useState<AdminMessageLogItem | null>(null);

  const { sortKey, sortOrder, handleSort, sortData } =
    useTableSort<AdminMessageLogItem>({
      initialKey: "createdAt",
      initialOrder: "desc",
    });

  const sortedData = sortData(logs);

  const getStatusBadge = (status: string) => {
    const upper = (status || "").toUpperCase();
    switch (upper) {
      case "SENT":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"
          >
            <Send className="size-3" />
            <span>{t("admin.messages.statusSent")}</span>
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 font-bold text-emerald-700 dark:text-wise-green flex items-center gap-1"
          >
            <CheckCircle2 className="size-3" />
            <span>{t("admin.messages.statusDelivered")}</span>
          </Badge>
        );
      case "READ":
        return (
          <Badge
            variant="outline"
            className="border-teal-500/20 bg-teal-500/10 font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1"
          >
            <CheckCheck className="size-3" />
            <span>{t("admin.messages.statusRead")}</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/20 bg-rose-500/10 font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1"
          >
            <AlertCircle className="size-3" />
            <span>{t("admin.messages.statusFailed")}</span>
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/20 bg-amber-500/10 font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1"
          >
            <Clock className="size-3" />
            <span>{t("admin.messages.statusPending")}</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-bold">
            {status}
          </Badge>
        );
    }
  };

  const formatLocalizedDate = (dateInput?: string): string => {
    if (!dateInput) return "-";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <SearchInput
              value={searchQuery}
              onSearch={onSearch}
              onClear={onClearSearch}
              placeholder={t("admin.messages.searchPlaceholder")}
            />
          </div>

          <div className="w-full sm:w-40">
            <NativeSelect
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="h-9 rounded-full text-xs font-bold"
            >
              <option value="ALL">{t("admin.messages.filterAllStatus")}</option>
              <option value="SENT">{t("admin.messages.filterSent")}</option>
              <option value="DELIVERED">
                {t("admin.messages.filterDelivered")}
              </option>
              <option value="READ">{t("admin.messages.filterRead")}</option>
              <option value="FAILED">{t("admin.messages.filterFailed")}</option>
              <option value="PENDING">
                {t("admin.messages.filterPending")}
              </option>
            </NativeSelect>
          </div>

          <div className="w-full sm:w-40">
            <NativeSelect
              value={directionFilter}
              onChange={(e) => onDirectionFilterChange(e.target.value)}
              className="h-9 rounded-full text-xs font-bold"
            >
              <option value="ALL">
                {t("admin.messages.filterAllDirection")}
              </option>
              <option value="OUTBOUND">
                {t("admin.messages.filterOutbound")}
              </option>
              <option value="INBOUND">
                {t("admin.messages.filterInbound")}
              </option>
            </NativeSelect>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="border-border hover:bg-muted h-9 shrink-0 gap-1.5 rounded-full text-xs font-bold"
        >
          <RefreshCw
            className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>{t("common.refresh")}</span>
        </Button>
      </div>

      {/* Main Table */}
      <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 border-border border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-3">
                  <DataTableColumnHeader
                    title={t("admin.messages.colRecipient")}
                    columnKey="recipientJid"
                    currentSortKey={sortKey as string}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="py-3">
                  <DataTableColumnHeader
                    title={t("admin.messages.colDirection")}
                    columnKey="direction"
                    currentSortKey={sortKey as string}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-xs font-black tracking-wider uppercase">
                  {t("admin.messages.colSnippet")}
                </TableHead>
                <TableHead className="py-3">
                  <DataTableColumnHeader
                    title={t("admin.messages.colStatus")}
                    columnKey="status"
                    currentSortKey={sortKey as string}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="py-3 text-right">
                  <DataTableColumnHeader
                    title={t("admin.messages.colTimestamp")}
                    columnKey="createdAt"
                    currentSortKey={sortKey as string}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                    align="right"
                  />
                </TableHead>
                <TableHead className="text-foreground-secondary py-3 text-right text-xs font-black tracking-wider uppercase">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-border divide-y">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="dark:text-wise-green size-6 animate-spin text-emerald-600" />
                      <span className="text-foreground-secondary text-xs font-semibold">
                        {t("admin.messages.loadingLogs")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-8">
                    <EmptyState
                      icon={<MessageSquare className="size-10" />}
                      title={t("admin.messages.emptyTitle")}
                      description={
                        searchQuery || statusFilter !== "ALL"
                          ? t("admin.messages.emptyFilterDesc")
                          : t("admin.messages.emptyDesc")
                      }
                      action={
                        searchQuery || statusFilter !== "ALL" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onClearSearch();
                              onStatusFilterChange("ALL");
                              onDirectionFilterChange("ALL");
                            }}
                            className="rounded-full text-xs font-bold"
                          >
                            {t("admin.messages.resetFiltersBtn")}
                          </Button>
                        ) : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((log: AdminMessageLogItem) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Recipient */}
                    <TableCell className="py-3 font-mono text-xs font-bold">
                      {log.recipientJid}
                    </TableCell>

                    {/* Direction */}
                    <TableCell className="py-3 text-xs font-semibold">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          log.direction === "OUTBOUND"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        }`}
                      >
                        {log.direction}
                      </span>
                    </TableCell>

                    {/* Snippet */}
                    <TableCell className="max-w-xs py-3">
                      <div className="flex items-center gap-1.5">
                        {log.mediaUrl && (
                          <Paperclip className="text-foreground-muted size-3 shrink-0" />
                        )}
                        <span className="text-foreground-secondary truncate text-xs font-semibold">
                          {log.messageBody || t("admin.messages.emptySnippet")}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3 font-mono text-xs">
                      {getStatusBadge(log.status)}
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell className="text-foreground-secondary py-3 text-right font-mono text-[11px]">
                      {formatLocalizedDate(log.createdAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedMessageForDetail(log)}
                          className="hover:bg-muted text-foreground-secondary hover:text-foreground size-8 rounded-full"
                          title={t("admin.messages.viewDetailTooltip")}
                        >
                          <Eye className="size-3.5" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedMessageForDelete(log)}
                          className="text-foreground-muted hover:bg-rose-500/10 hover:text-rose-600 size-8 rounded-full"
                          title={t("admin.messages.deleteLogTooltip")}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Bar */}
        {logs.length > 0 && (
          <div className="border-border border-t p-3 sm:p-4">
            <DataTablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <MessageDetailModal
        message={selectedMessageForDetail}
        isOpen={Boolean(selectedMessageForDetail)}
        onClose={() => setSelectedMessageForDetail(null)}
      />

      <DeleteMessageModal
        message={selectedMessageForDelete}
        isOpen={Boolean(selectedMessageForDelete)}
        onClose={() => setSelectedMessageForDelete(null)}
        onConfirm={async () => {
          if (selectedMessageForDelete) {
            await onDelete(selectedMessageForDelete.id);
          }
        }}
      />
    </div>
  );
}
