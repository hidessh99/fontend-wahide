"use client";

import React, { useState } from "react";
import { AdminQueueItem } from "@/modules/admin/types/admin.types";
import { DeleteQueueModal } from "./DeleteQueueModal";
import { QueueDetailModal } from "./QueueDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { formatDateTime } from "@/lib/utils";
import {
  RefreshCw,
  Layers,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  Trash2,
  Eye,
  Loader2,
  Mail,
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
        <Badge variant="success">
          <CheckCircle2 className="size-3" />
          <span>Selesai</span>
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="warning">
          <Clock className="size-3" />
          <span>Menunggu</span>
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge variant="info">
          <RotateCcw className="size-3 animate-spin" />
          <span>Diproses</span>
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

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<AdminQueueItem>({
    initialKey: "createdAt",
    initialOrder: "desc",
  });

  const sortedQueues = sortData(queues);

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

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="border-border bg-surface rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => onSearch(searchInput.trim())}
            onClear={handleResetSearch}
            placeholder="Cari berdasarkan tipe tugas, target email, atau kata kunci..."
          />

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
          <EmptyState
            icon={<Layers />}
            title="Tidak Ada Antrean Ditemukan"
            description={
              searchQuery
                ? `Tidak ditemukan antrean dengan kata kunci "${searchQuery}".`
                : "Saat ini tidak ada antrean notifikasi atau pengiriman email."
            }
          />
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {sortedQueues.map((q) => (
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
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[20%] px-5 py-3.5">
                      <DataTableColumnHeader
                        title="Tipe Tugas & ID"
                        columnKey="taskType"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[25%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Target Penerima
                      </div>
                    </TableHead>
                    <TableHead className="w-[15%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title="Percobaan"
                        columnKey="attempts"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[12%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title="Status"
                        columnKey="status"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[16%] px-4 py-3.5">
                      <DataTableColumnHeader
                        title="Jadwal / Waktu"
                        columnKey="createdAt"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[12%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Aksi
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedQueues.map((q) => (
                    <TableRow key={q.id} className="hover:bg-muted/30 transition-colors">
                      {/* 1. Tipe Tugas & ID */}
                      <TableCell className="px-5 py-3.5 align-middle">
                        <div className="space-y-0.5">
                          <span className="dark:text-wise-green inline-block rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-black tracking-wider text-emerald-700 uppercase">
                            {q.taskType}
                          </span>
                          <span className="text-foreground-muted block font-mono text-[11px]">
                            {q.id.slice(0, 16)}...
                          </span>
                        </div>
                      </TableCell>

                      {/* 2. Target Penerima */}
                      <TableCell className="px-4 py-3.5 align-middle">
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
                      </TableCell>

                      {/* 3. Percobaan & Prioritas */}
                      <TableCell className="px-3 py-3.5 text-center align-middle font-mono">
                        <span className="text-foreground font-bold">
                          {q.attempts} / {q.maxAttempts}
                        </span>
                        <span className="text-foreground-muted block text-[10px]">
                          Prioritas: {q.priority}
                        </span>
                      </TableCell>

                      {/* 4. Status */}
                      <TableCell className="px-3 py-3.5 text-center align-middle">
                        <div className="inline-flex items-center justify-center">
                          {getQueueStatusBadge(q.status)}
                        </div>
                      </TableCell>

                      {/* 5. Jadwal / Waktu */}
                      <TableCell className="text-foreground-secondary px-4 py-3.5 align-middle font-mono text-[11px]">
                        {formatDateTime(q.createdAt)}
                      </TableCell>

                      {/* 6. Aksi */}
                      <TableCell className="px-5 py-3.5 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(q)}
                            className="border-border hover:bg-muted h-8 gap-1 rounded-full px-2.5 text-xs font-bold"
                            title="Lihat Detail Payload & Error"
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
