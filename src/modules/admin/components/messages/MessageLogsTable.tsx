"use client";

import React, { useState } from "react";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
import { DeleteMessageModal } from "./DeleteMessageModal";
import { MessageDetailModal } from "./MessageDetailModal";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/pagination";
import { formatDateTime } from "@/lib/utils";
import {
  Search,
  X,
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
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-blue-600 uppercase dark:text-blue-400">
          <CheckCheck className="size-3" />
          <span>Terbaca</span>
        </span>
      );
    case "DELIVERED":
      return (
        <span className="dark:text-wise-green inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-emerald-700 uppercase">
          <CheckCircle2 className="size-3" />
          <span>Tersampaikan</span>
        </span>
      );
    case "SENT":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-teal-600 uppercase dark:text-teal-400">
          <Send className="size-3" />
          <span>Terkirim</span>
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-amber-700 uppercase dark:text-amber-400">
          <Clock className="size-3" />
          <span>Menunggu</span>
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-rose-600 uppercase dark:text-rose-400">
          <AlertCircle className="size-3" />
          <span>Gagal</span>
        </span>
      );
    default:
      return (
        <span className="bg-muted text-foreground-secondary border-border rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
          {status}
        </span>
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

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

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="border-border bg-surface rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan nomor WhatsApp, isi pesan, atau ID..."
                className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-9 pl-10 text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
              />
              {(searchInput || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
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

          {/* Filters & Refresh */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {/* Direction Filter */}
            <select
              value={directionFilter}
              onChange={(e) => onDirectionFilterChange(e.target.value)}
              className="bg-surface text-foreground border-border dark:focus:border-wise-green h-10 cursor-pointer rounded-full border px-3.5 text-xs font-semibold outline-none focus:border-emerald-600 dark:bg-[#10110e]"
            >
              <option value="ALL">Semua Arah</option>
              <option value="OUTBOUND">↗️ Keluar (OUTBOUND)</option>
              <option value="INBOUND">↙️ Masuk (INBOUND)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-surface text-foreground border-border dark:focus:border-wise-green h-10 cursor-pointer rounded-full border px-3.5 text-xs font-semibold outline-none focus:border-emerald-600 dark:bg-[#10110e]"
            >
              <option value="ALL">Semua Status</option>
              <option value="READ">🔵 Terbaca (READ)</option>
              <option value="DELIVERED">🟢 Tersampaikan (DELIVERED)</option>
              <option value="SENT">🟢 Terkirim (SENT)</option>
              <option value="PENDING">🟡 Menunggu (PENDING)</option>
              <option value="FAILED">🔴 Gagal (FAILED)</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted size-10 shrink-0 cursor-pointer rounded-full p-0"
              aria-label="Refresh Data Log Pesan"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
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
          <div className="space-y-2 p-10 text-center">
            <MessageSquare className="text-foreground-muted mx-auto size-8" />
            <div className="text-foreground text-xs font-bold">Tidak Ada Pesan Ditemukan</div>
            <p className="text-foreground-muted mx-auto max-w-sm text-[11px]">
              {searchQuery
                ? `Tidak ditemukan pesan dengan kata kunci "${searchQuery}".`
                : "Saat ini belum ada riwayat pesan WhatsApp yang tercatat di sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {logs.map((m) => (
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
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border bg-muted/50 text-foreground-muted border-b text-[11px] font-extrabold tracking-wider uppercase select-none">
                    <th className="px-5 py-3.5 font-extrabold">Waktu &amp; ID</th>
                    <th className="px-4 py-3.5 font-extrabold">Penerima (Nomor/JID)</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Arah</th>
                    <th className="px-4 py-3.5 font-extrabold">Cuplikan Pesan</th>
                    <th className="px-3 py-3.5 font-extrabold">Perangkat</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Status</th>
                    <th className="px-5 py-3.5 text-right font-extrabold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y text-xs font-semibold">
                  {logs.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30 group transition-colors">
                      {/* 1. Waktu & ID */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <span className="text-foreground block font-mono text-[11px] font-bold">
                            {formatDateTime(m.createdAt)}
                          </span>
                          <span className="text-foreground-muted block font-mono text-[10px]">
                            {m.id.slice(0, 16)}...
                          </span>
                        </div>
                      </td>

                      {/* 2. Target Nomor / JID */}
                      <td className="px-4 py-3.5">
                        <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
                          <Smartphone className="text-foreground-muted size-3 shrink-0" />
                          <span className="max-w-45 truncate">{m.recipientJid}</span>
                        </div>
                      </td>

                      {/* 3. Arah Pesan */}
                      <td className="px-3 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                            m.direction === "OUTBOUND"
                              ? "dark:text-wise-green border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                              : "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {m.direction === "OUTBOUND" ? "↗️ OUT" : "↙️ IN"}
                        </span>
                      </td>

                      {/* 4. Cuplikan Pesan */}
                      <td className="max-w-xs px-4 py-3.5">
                        <div className="space-y-1">
                          <p className="text-foreground max-w-[260px] truncate text-xs font-medium">
                            {m.messageBody || "(Pesan kosong)"}
                          </p>
                          {m.mediaUrl && (
                            <span className="bg-muted text-foreground-muted border-border inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold">
                              <Paperclip className="size-2.5" />
                              <span>Lampiran Media</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Perangkat */}
                      <td className="px-3 py-3.5">
                        <span className="text-foreground-secondary block max-w-24 truncate font-mono text-[11px]">
                          {m.deviceId || "-"}
                        </span>
                      </td>

                      {/* 6. Status */}
                      <td className="px-3 py-3.5 text-center">{getMessageStatusBadge(m.status)}</td>

                      {/* 7. Aksi */}
                      <td className="px-5 py-3.5 text-right">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Responsive Pagination Footer */}
        {total > 0 && (
          <div className="border-border bg-muted/20 flex flex-col items-center justify-between gap-3 border-t p-3.5 sm:flex-row sm:px-5 sm:py-3.5">
            <div className="text-foreground-secondary flex items-center gap-3 text-xs font-semibold">
              <span>
                Menampilkan{" "}
                <strong className="text-foreground">
                  {startItem} - {endItem}
                </strong>{" "}
                dari <strong className="text-foreground">{total}</strong> pesan
              </span>

              <div className="text-foreground-muted flex items-center gap-1.5 text-xs">
                <span>| Baris:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="bg-surface border-border text-foreground h-7 cursor-pointer rounded-md border px-2 text-xs font-bold outline-none dark:bg-[#10110e]"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <DataTablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              className="mx-0 w-auto"
            />
          </div>
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
