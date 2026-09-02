"use client";

import React, { useState } from "react";
import { AdminMessageLogItem } from "@/modules/admin/types/admin.types";
import { DeleteMessageModal } from "./DeleteMessageModal";
import { MessageDetailModal } from "./MessageDetailModal";
import { Button } from "@/components/ui/button";
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
  ChevronLeft,
  ChevronRight,
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <CheckCheck className="size-3" />
          <span>Terbaca</span>
        </span>
      );
    case "DELIVERED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20">
          <CheckCircle2 className="size-3" />
          <span>Tersampaikan</span>
        </span>
      );
    case "SENT":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
          <Send className="size-3" />
          <span>Terkirim</span>
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <Clock className="size-3" />
          <span>Menunggu</span>
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <AlertCircle className="size-3" />
          <span>Gagal</span>
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground-secondary border border-border">
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
  const [selectedMessageForDelete, setSelectedMessageForDelete] = useState<AdminMessageLogItem | null>(null);
  const [selectedMessageForDetail, setSelectedMessageForDetail] = useState<AdminMessageLogItem | null>(null);
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

  // Pagination numbers
  const pageNumbers: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan nomor WhatsApp, isi pesan, atau ID..."
                className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
              />
              {(searchInput || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
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

          {/* Filters & Refresh */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Direction Filter */}
            <select
              value={directionFilter}
              onChange={(e) => onDirectionFilterChange(e.target.value)}
              className="h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-emerald-600 dark:focus:border-wise-green cursor-pointer"
            >
              <option value="ALL">Semua Arah</option>
              <option value="OUTBOUND">↗️ Keluar (OUTBOUND)</option>
              <option value="INBOUND">↙️ Masuk (INBOUND)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-emerald-600 dark:focus:border-wise-green cursor-pointer"
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
              className="rounded-full size-10 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0"
              aria-label="Refresh Data Log Pesan"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Message Logs Table & Mobile View */}
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-foreground-muted">
            <Loader2 className="size-7 animate-spin text-emerald-600 dark:text-wise-green" />
            <span className="text-xs font-bold">Memuat riwayat log pesan WhatsApp...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <MessageSquare className="size-8 mx-auto text-foreground-muted" />
            <div className="text-xs font-bold text-foreground">Tidak Ada Pesan Ditemukan</div>
            <p className="text-[11px] text-foreground-muted max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ditemukan pesan dengan kata kunci "${searchQuery}".`
                : "Saat ini belum ada riwayat pesan WhatsApp yang tercatat di sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="lg:hidden divide-y divide-border/60">
              {logs.map((m) => (
                <div key={m.id} className="p-4 space-y-3 bg-surface dark:bg-[#161715]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                            m.direction === "OUTBOUND"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-wise-green border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {m.direction === "OUTBOUND" ? "↗️ OUTBOUND" : "↙️ INBOUND"}
                        </span>
                        {m.mediaUrl && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-foreground-muted border border-border flex items-center gap-1">
                            <Paperclip className="size-2.5" />
                            <span>Media</span>
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-foreground font-bold block">
                        {m.recipientJid}
                      </span>
                    </div>

                    <div className="shrink-0">{getMessageStatusBadge(m.status)}</div>
                  </div>

                  {/* Message body preview */}
                  <p className="text-xs text-foreground font-medium bg-muted/30 p-2 rounded-lg border border-border/60 line-clamp-2 italic">
                    &quot;{m.messageBody}&quot;
                  </p>

                  {m.errorMessage && (
                    <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] truncate font-mono">
                      Error: {m.errorMessage}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1">
                    <span className="font-mono text-[10px]">Dev: {m.deviceId.slice(0, 10)}...</span>
                    <span>{formatDateTime(m.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-border/50 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(m)}
                      className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:bg-muted cursor-pointer"
                    >
                      <Eye className="size-3.5" />
                      <span>Detail</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDelete(m)}
                      className="h-8 size-8 p-0 rounded-full border-border hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-600 cursor-pointer"
                      title="Hapus Log Pesan"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 1024px) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-[11px] font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                    <th className="py-3.5 px-5 font-extrabold">Waktu &amp; ID</th>
                    <th className="py-3.5 px-4 font-extrabold">Penerima (Nomor/JID)</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Arah</th>
                    <th className="py-3.5 px-4 font-extrabold">Cuplikan Pesan</th>
                    <th className="py-3.5 px-3 font-extrabold">Perangkat</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Status</th>
                    <th className="py-3.5 px-5 font-extrabold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs font-semibold">
                  {logs.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors group">
                      {/* 1. Waktu & ID */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground block font-mono text-[11px]">
                            {formatDateTime(m.createdAt)}
                          </span>
                          <span className="font-mono text-[10px] text-foreground-muted block">
                            {m.id.slice(0, 16)}...
                          </span>
                        </div>
                      </td>

                      {/* 2. Target Nomor / JID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-foreground font-bold">
                          <Smartphone className="size-3 text-foreground-muted shrink-0" />
                          <span className="truncate max-w-45">{m.recipientJid}</span>
                        </div>
                      </td>

                      {/* 3. Arah Pesan */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                            m.direction === "OUTBOUND"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-wise-green border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {m.direction === "OUTBOUND" ? "↗️ OUT" : "↙️ IN"}
                        </span>
                      </td>

                      {/* 4. Cuplikan Pesan */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          <p className="text-foreground font-medium truncate max-w-[260px] text-xs">
                            {m.messageBody || "(Pesan kosong)"}
                          </p>
                          {m.mediaUrl && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-foreground-muted border border-border">
                              <Paperclip className="size-2.5" />
                              <span>Lampiran Media</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Perangkat */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[11px] text-foreground-secondary block truncate max-w-24">
                          {m.deviceId || "-"}
                        </span>
                      </td>

                      {/* 6. Status */}
                      <td className="py-3.5 px-3 text-center">{getMessageStatusBadge(m.status)}</td>

                      {/* 7. Aksi */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(m)}
                            className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:bg-muted cursor-pointer"
                            title="Lihat Detail Pesan"
                          >
                            <Eye className="size-3.5 text-foreground-secondary" />
                            <span>Detail</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(m)}
                            className="h-8 size-8 p-0 rounded-full border-border hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-600 cursor-pointer"
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:px-5 sm:py-3.5 border-t border-border bg-muted/20">
            <div className="flex items-center gap-3 text-xs font-semibold text-foreground-secondary">
              <span>
                Menampilkan <strong className="text-foreground">{startItem} - {endItem}</strong> dari{" "}
                <strong className="text-foreground">{total}</strong> pesan
              </span>

              <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <span>| Baris:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="h-7 px-2 rounded-md bg-surface dark:bg-[#10110e] border border-border text-foreground font-bold text-xs outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onPrevPage}
                disabled={page <= 1}
                className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`size-8 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                    page === p
                      ? "bg-emerald-600 dark:bg-wise-green text-white dark:text-black font-black shadow-xs"
                      : "text-foreground-secondary hover:bg-muted border border-border"
                  }`}
                >
                  {p}
                </button>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={page >= totalPages}
                className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
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
