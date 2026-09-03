"use client";

import React, { useState } from "react";
import { AdminQueueItem } from "@/modules/admin/types/admin.types";
import { DeleteQueueModal } from "./DeleteQueueModal";
import { QueueDetailModal } from "./QueueDetailModal";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import {
  Search,
  X,
  RefreshCw,
  Layers,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
} from "lucide-react";

interface QueueMonitorTableProps {
  queues: AdminQueueItem[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onRefresh: () => void;
  onDelete: (id: string) => Promise<unknown>;
  onSearch: (q: string) => void;
  onClearSearch: () => void;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

function getQueueStatusBadge(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "COMPLETED":
      return (
        <span className="dark:text-wise-green inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-emerald-700 uppercase">
          <CheckCircle2 className="size-3" />
          <span>Selesai</span>
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-amber-700 uppercase dark:text-amber-400">
          <Clock className="size-3" />
          <span>Menunggu</span>
        </span>
      );
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-blue-600 uppercase dark:text-blue-400">
          <RotateCcw className="size-3 animate-spin" />
          <span>Diproses</span>
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

export function QueueMonitorTable({
  queues,
  isLoading,
  searchQuery,
  statusFilter,
  page,
  pageSize,
  total,
  totalPages,
  onRefresh,
  onDelete,
  onSearch,
  onClearSearch,
  onStatusFilterChange,
  onPageChange,
  onPageSizeChange,
  onNextPage,
  onPrevPage,
}: QueueMonitorTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedQueueForDelete, setSelectedQueueForDelete] = useState<AdminQueueItem | null>(null);
  const [selectedQueueForDetail, setSelectedQueueForDetail] = useState<AdminQueueItem | null>(null);
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

  const handleOpenDelete = (q: AdminQueueItem) => {
    setSelectedQueueForDelete(q);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = (q: AdminQueueItem) => {
    setSelectedQueueForDetail(q);
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
      <div className="border-border bg-surface rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan tipe tugas, target email, atau kata kunci..."
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
          <div className="flex shrink-0 items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-surface text-foreground border-border dark:focus:border-wise-green h-10 flex-1 cursor-pointer rounded-full border px-3.5 text-xs font-semibold outline-none focus:border-emerald-600 sm:flex-initial dark:bg-[#10110e]"
            >
              <option value="ALL">Semua Status</option>
              <option value="COMPLETED">🟢 Selesai (COMPLETED)</option>
              <option value="PENDING">🟡 Menunggu (PENDING)</option>
              <option value="PROCESSING">🔵 Diproses (PROCESSING)</option>
              <option value="FAILED">🔴 Gagal (FAILED)</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted size-10 shrink-0 cursor-pointer rounded-full p-0"
              aria-label="Refresh Data Antrean"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Queue Data Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">Memuat antrean tugas background worker...</span>
          </div>
        ) : queues.length === 0 ? (
          <div className="space-y-2 p-10 text-center">
            <Layers className="text-foreground-muted mx-auto size-8" />
            <div className="text-foreground text-xs font-bold">Tidak Ada Antrean Ditemukan</div>
            <p className="text-foreground-muted mx-auto max-w-sm text-[11px]">
              {searchQuery
                ? `Tidak ditemukan antrean dengan kata kunci "${searchQuery}".`
                : "Saat ini tidak ada antrean notifikasi atau pengiriman email."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {queues.map((q) => (
                <div key={q.id} className="bg-surface space-y-3 p-4 dark:bg-[#161715]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="dark:text-wise-green mb-1 block w-fit rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-black tracking-wider text-emerald-700 uppercase">
                        {q.taskType}
                      </span>
                      <span className="text-foreground flex items-center gap-1 font-mono text-xs font-bold">
                        <Mail className="text-foreground-muted size-3" />
                        <span>{q.targetEmail || "-"}</span>
                      </span>
                    </div>

                    <div className="shrink-0">{getQueueStatusBadge(q.status)}</div>
                  </div>

                  {q.lastError && (
                    <div className="truncate rounded border border-rose-500/20 bg-rose-500/10 p-2 font-mono text-[11px] text-rose-600 dark:text-rose-400">
                      Error: {q.lastError}
                    </div>
                  )}

                  <div className="text-foreground-muted flex items-center justify-between pt-1 text-[11px]">
                    <span>
                      Percobaan: {q.attempts}/{q.maxAttempts} (P: {q.priority})
                    </span>
                    <span>{formatDateTime(q.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(q)}
                      className="border-border hover:bg-muted h-8 gap-1 rounded-full px-2.5 text-xs font-bold"
                    >
                      <Eye className="size-3.5" />
                      <span>Detail</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDelete(q)}
                      className="border-border size-8 h-8 rounded-full p-0 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                      title="Hapus Antrean"
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
                    <th className="px-5 py-3.5 font-extrabold">Tipe Tugas &amp; ID</th>
                    <th className="px-4 py-3.5 font-extrabold">Target Penerima</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Percobaan</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Status</th>
                    <th className="px-4 py-3.5 font-extrabold">Jadwal / Waktu</th>
                    <th className="px-5 py-3.5 text-right font-extrabold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y text-xs font-semibold">
                  {queues.map((q) => (
                    <tr key={q.id} className="hover:bg-muted/30 group transition-colors">
                      {/* 1. Tipe Tugas & ID */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <span className="dark:text-wise-green inline-block rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-black tracking-wider text-emerald-700 uppercase">
                            {q.taskType}
                          </span>
                          <span className="text-foreground-muted block font-mono text-[11px]">
                            {q.id.slice(0, 16)}...
                          </span>
                        </div>
                      </td>

                      {/* 2. Target Penerima */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          <span className="text-foreground block font-mono font-bold">
                            {q.targetEmail || "-"}
                          </span>
                          {q.targetName && (
                            <span className="text-foreground-secondary block text-[11px]">
                              {q.targetName}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Percobaan & Prioritas */}
                      <td className="px-3 py-3.5 text-center font-mono">
                        <span className="text-foreground font-bold">
                          {q.attempts} / {q.maxAttempts}
                        </span>
                        <span className="text-foreground-muted block text-[10px]">
                          Prioritas: {q.priority}
                        </span>
                      </td>

                      {/* 4. Status */}
                      <td className="px-3 py-3.5 text-center">{getQueueStatusBadge(q.status)}</td>

                      {/* 5. Jadwal / Waktu */}
                      <td className="text-foreground-secondary px-4 py-3.5 font-mono text-[11px]">
                        {formatDateTime(q.createdAt)}
                      </td>

                      {/* 6. Aksi */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(q)}
                            className="border-border hover:bg-muted h-8 gap-1 rounded-full px-2.5 text-xs font-bold"
                            title="Lihat Detail Payload &amp; Error"
                          >
                            <Eye className="text-foreground-secondary size-3.5" />
                            <span>Detail</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(q)}
                            className="border-border size-8 h-8 rounded-full p-0 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                            title="Hapus Antrean"
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
                dari <strong className="text-foreground">{total}</strong> antrean
              </span>

              <div className="text-foreground-muted flex items-center gap-1.5 text-xs">
                <span>| Baris:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="bg-surface border-border text-foreground h-7 cursor-pointer rounded-md border px-2 text-xs font-bold outline-none dark:bg-[#10110e]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
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
                className="border-border hover:border-foreground-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`flex size-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition ${
                    page === p
                      ? "dark:bg-wise-green bg-emerald-600 font-black text-white shadow-xs dark:text-black"
                      : "text-foreground-secondary hover:bg-muted border-border border"
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
                className="border-border hover:border-foreground-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold disabled:opacity-40"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Queue Modal */}
      <DeleteQueueModal
        queue={selectedQueueForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (selectedQueueForDelete) {
            await onDelete(selectedQueueForDelete.id);
          }
        }}
      />

      {/* Queue Detail Modal */}
      <QueueDetailModal
        queue={selectedQueueForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
