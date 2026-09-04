"use client";

import React, { useState } from "react";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
import { DeleteMessageModal } from "./DeleteMessageModal";
import { MessageDetailModal } from "./MessageDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { NativeSelect } from "@/components/ui/native-select";
import { formatDateTime } from "@/lib/utils";
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
  Smartphone,
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
  onDirectionFilterChange: (direction: string) => void;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

function getMessageStatusBadge(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "READ":
      return (
        <Badge variant="info">
          <CheckCheck className="size-3" />
          <span>Terbaca</span>
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge variant="success">
          <CheckCircle2 className="size-3" />
          <span>Tersampaikan</span>
        </Badge>
      );
    case "SENT":
      return (
        <Badge
          variant="outline"
          className="border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400"
        >
          <Send className="size-3" />
          <span>Terkirim</span>
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="warning">
          <Clock className="size-3" />
          <span>Menunggu</span>
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="danger">
          <AlertCircle className="size-3" />
          <span>Gagal</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral">
          <span>{status}</span>
        </Badge>
      );
  }
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
  const [searchInput, setSearchInput] = useState("");
  const [selectedMessageForDelete, setSelectedMessageForDelete] =
    useState<AdminMessageLogItem | null>(null);
  const [selectedMessageForDetail, setSelectedMessageForDetail] =
    useState<AdminMessageLogItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<AdminMessageLogItem>({
    initialKey: "createdAt",
    initialOrder: "desc",
  });

  const sortedLogs = sortData(logs);

  const handleResetSearch = () => {
    setSearchInput("");
    onClearSearch();
  };

  const handleOpenDelete = (m: AdminMessageLogItem) => {
    setSelectedMessageForDelete(m);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = (m: AdminMessageLogItem) => {
    setSelectedMessageForDetail(m);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="border-border bg-surface rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
          {/* Search Form */}
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => onSearch(searchInput.trim())}
            onClear={handleResetSearch}
            placeholder="Cari berdasarkan nomor WhatsApp, isi pesan, atau ID..."
          />

          {/* Filters & Refresh */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {/* Direction Filter */}
            <NativeSelect
              value={directionFilter}
              onChange={(e) => onDirectionFilterChange(e.target.value)}
              variant="pill"
            >
              <option value="ALL">Semua Arah</option>
              <option value="OUTBOUND">↗️ Keluar (OUTBOUND)</option>
              <option value="INBOUND">↙️ Masuk (INBOUND)</option>
            </NativeSelect>

            {/* Status Filter */}
            <NativeSelect
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              variant="pill"
            >
              <option value="ALL">Semua Status</option>
              <option value="READ">🔵 Terbaca (READ)</option>
              <option value="DELIVERED">🟢 Tersampaikan (DELIVERED)</option>
              <option value="SENT">🟢 Terkirim (SENT)</option>
              <option value="PENDING">🟡 Menunggu (PENDING)</option>
              <option value="FAILED">🔴 Gagal (FAILED)</option>
            </NativeSelect>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
              aria-label="Refresh Data Log Pesan"
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Message Logs Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">Memuat riwayat log pesan WhatsApp...</span>
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={<MessageSquare />}
            title="Tidak Ada Pesan Ditemukan"
            description={
              searchQuery
                ? `Tidak ditemukan pesan dengan kata kunci "${searchQuery}".`
                : "Saat ini belum ada riwayat pesan WhatsApp yang tercatat di sistem."
            }
          />
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {sortedLogs.map((m) => (
                <div key={m.id} className="bg-surface space-y-3 p-4 dark:bg-[#161715]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5">
                        <span
                          className={`rounded border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                            m.direction === "OUTBOUND"
                              ? "dark:text-wise-green border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                              : "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {m.direction === "OUTBOUND" ? "↗️ OUTBOUND" : "↙️ INBOUND"}
                        </span>
                        {m.mediaUrl && (
                          <span className="bg-muted text-foreground-muted border-border flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold">
                            <Paperclip className="size-2.5" />
                            <span>Media</span>
                          </span>
                        )}
                      </div>
                      <span className="text-foreground block font-mono text-xs font-bold">
                        {m.recipientJid}
                      </span>
                    </div>

                    <div className="shrink-0">{getMessageStatusBadge(m.status)}</div>
                  </div>

                  {/* Message body preview */}
                  <p className="text-foreground bg-muted/30 border-border/60 line-clamp-2 rounded-lg border p-2 text-xs font-medium italic">
                    &quot;{m.messageBody}&quot;
                  </p>

                  {m.errorMessage && (
                    <div className="truncate rounded border border-rose-500/20 bg-rose-500/10 p-2 font-mono text-[11px] text-rose-600 dark:text-rose-400">
                      Error: {m.errorMessage}
                    </div>
                  )}

                  <div className="text-foreground-muted flex items-center justify-between pt-1 text-[11px]">
                    <span className="font-mono text-[10px]">Dev: {m.deviceId.slice(0, 10)}...</span>
                    <span>{formatDateTime(m.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(m)}
                      className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                    >
                      <Eye className="size-3.5" />
                      <span>Detail</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDelete(m)}
                      className="border-border size-8 h-8 cursor-pointer rounded-full p-0 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                      title="Hapus Log Pesan"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 1024px) */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[18%] px-5 py-3.5">
                      <DataTableColumnHeader
                        title="Waktu & ID"
                        columnKey="createdAt"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[18%] px-4 py-3.5">
                      <DataTableColumnHeader
                        title="Penerima (Nomor/JID)"
                        columnKey="recipientJid"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Arah
                      </div>
                    </TableHead>
                    <TableHead className="w-[26%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Cuplikan Pesan
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Perangkat
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title="Status"
                        columnKey="status"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[8%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Aksi
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogs.map((m) => (
                    <TableRow key={m.id} className="hover:bg-muted/30 transition-colors">
                      {/* 1. Waktu & ID */}
                      <TableCell className="px-5 py-3.5 align-middle">
                        <div className="space-y-0.5">
                          <span className="text-foreground block font-mono text-[11px] font-bold">
                            {formatDateTime(m.createdAt)}
                          </span>
                          <span className="text-foreground-muted block font-mono text-[10px]">
                            {m.id.slice(0, 16)}...
                          </span>
                        </div>
                      </TableCell>

                      {/* 2. Target Nomor / JID */}
                      <TableCell className="px-4 py-3.5 align-middle">
                        <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
                          <Smartphone className="text-foreground-muted size-3 shrink-0" />
                          <span className="max-w-45 truncate">{m.recipientJid}</span>
                        </div>
                      </TableCell>

                      {/* 3. Arah Pesan */}
                      <TableCell className="px-3 py-3.5 text-center align-middle">
                        <span
                          className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                            m.direction === "OUTBOUND"
                              ? "dark:text-wise-green border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                              : "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {m.direction === "OUTBOUND" ? "↗️ OUT" : "↙️ IN"}
                        </span>
                      </TableCell>

                      {/* 4. Cuplikan Pesan */}
                      <TableCell className="max-w-xs px-4 py-3.5 align-middle">
                        <div className="space-y-1">
                          <p className="text-foreground max-w-65 truncate text-xs font-medium">
                            {m.messageBody || "(Pesan kosong)"}
                          </p>
                          {m.mediaUrl && (
                            <span className="bg-muted text-foreground-muted border-border inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold">
                              <Paperclip className="size-2.5" />
                              <span>Lampiran Media</span>
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* 5. Perangkat */}
                      <TableCell className="px-3 py-3.5 align-middle">
                        <span className="text-foreground-secondary block max-w-24 truncate font-mono text-[11px]">
                          {m.deviceId || "-"}
                        </span>
                      </TableCell>

                      {/* 6. Status */}
                      <TableCell className="px-3 py-3.5 text-center align-middle">
                        <div className="inline-flex items-center justify-center">
                          {getMessageStatusBadge(m.status)}
                        </div>
                      </TableCell>

                      {/* 7. Aksi */}
                      <TableCell className="px-5 py-3.5 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(m)}
                            className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                            title="Lihat Detail Pesan"
                          >
                            <Eye className="text-foreground-secondary size-3.5" />
                            <span>Detail</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(m)}
                            className="border-border size-8 h-8 cursor-pointer rounded-full p-0 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                            title="Hapus Log Pesan"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Responsive Pagination Footer */}
        {total > 0 && (
          <DataTablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={[10, 15, 25, 50, 100]}
            entityName="log pesan WhatsApp"
          />
        )}
      </div>

      {/* Delete Message Modal */}
      <DeleteMessageModal
        message={selectedMessageForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (selectedMessageForDelete) {
            await onDelete(selectedMessageForDelete.id);
          }
        }}
      />

      {/* Message Detail Modal */}
      <MessageDetailModal
        message={selectedMessageForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
