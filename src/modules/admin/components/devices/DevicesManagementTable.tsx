"use client";

import React, { useState } from "react";
import { AdminDeviceItem } from "@/modules/admin/types/admin.types";
import { DeleteDeviceModal } from "./DeleteDeviceModal";
import { DeviceDetailModal } from "./DeviceDetailModal";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import {
  Search,
  X,
  RefreshCw,
  Smartphone,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Wifi,
  WifiOff,
  QrCode,
  Moon,
  Ban,
} from "lucide-react";

interface DevicesManagementTableProps {
  devices: AdminDeviceItem[];
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

function getDeviceStatusBadge(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ONLINE":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20">
          <Wifi className="size-3" />
          <span>Online</span>
        </span>
      );
    case "OFFLINE":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground-secondary border border-border">
          <WifiOff className="size-3" />
          <span>Offline</span>
        </span>
      );
    case "QR_PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <QrCode className="size-3" />
          <span>Scan QR</span>
        </span>
      );
    case "HIBERNATED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Moon className="size-3" />
          <span>Hibernasi</span>
        </span>
      );
    case "BANNED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <Ban className="size-3" />
          <span>Banned</span>
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

export function DevicesManagementTable({
  devices,
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
}: DevicesManagementTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedDeviceForDelete, setSelectedDeviceForDelete] = useState<AdminDeviceItem | null>(null);
  const [selectedDeviceForDetail, setSelectedDeviceForDetail] = useState<AdminDeviceItem | null>(null);
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

  const handleOpenDelete = (d: AdminDeviceItem) => {
    setSelectedDeviceForDelete(d);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetail = (d: AdminDeviceItem) => {
    setSelectedDeviceForDetail(d);
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan nama perangkat, nomor WhatsApp, ID, atau Tenant..."
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

          {/* Filter Status & Refresh */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-emerald-600 dark:focus:border-wise-green cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="ONLINE">🟢 Online (Tersambung)</option>
              <option value="OFFLINE">⚪ Offline (Terputus)</option>
              <option value="QR_PENDING">🟡 Scan QR Pending</option>
              <option value="HIBERNATED">🔵 Hibernated</option>
              <option value="BANNED">🔴 Banned</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="rounded-full size-10 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0"
              aria-label="Refresh Data Perangkat"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Devices Table & Mobile View */}
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-foreground-muted">
            <Loader2 className="size-7 animate-spin text-emerald-600 dark:text-wise-green" />
            <span className="text-xs font-bold">Memuat data perangkat WhatsApp...</span>
          </div>
        ) : devices.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Smartphone className="size-8 mx-auto text-foreground-muted" />
            <div className="text-xs font-bold text-foreground">Tidak Ada Perangkat Ditemukan</div>
            <p className="text-[11px] text-foreground-muted max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ditemukan perangkat dengan kata kunci "${searchQuery}".`
                : "Saat ini belum ada perangkat WhatsApp yang terdaftar di sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="lg:hidden divide-y divide-border/60">
              {devices.map((d) => (
                <div key={d.id} className="p-4 space-y-3 bg-surface dark:bg-[#161715]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{d.pushName}</span>
                      </div>
                      <span className="font-mono text-xs text-foreground-secondary font-bold block">
                        {d.jid || "(Belum terhubung)"}
                      </span>
                    </div>

                    <div className="shrink-0">{getDeviceStatusBadge(d.status)}</div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg border border-border bg-muted/20 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-foreground-muted uppercase font-bold block">Trust</span>
                      <span className="font-mono font-bold text-foreground">{d.trustScore}/100</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-foreground-muted uppercase font-bold block">Warmup</span>
                      <span className="font-mono font-bold text-foreground">H-{d.warmupDay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-foreground-muted uppercase font-bold block">Terkirim</span>
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{d.dailySentCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1">
                    <span className="font-mono text-[10px] truncate max-w-30">Ten: {d.tenantId.slice(0, 10)}...</span>
                    <span>{formatDateTime(d.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-border/50 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(d)}
                      className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:bg-muted cursor-pointer"
                    >
                      <Eye className="size-3.5" />
                      <span>Detail</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDelete(d)}
                      className="h-8 size-8 p-0 rounded-full border-border hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-600 cursor-pointer"
                      title="Hapus Perangkat"
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
                    <th className="py-3.5 px-5 font-extrabold">Nama &amp; ID Perangkat</th>
                    <th className="py-3.5 px-4 font-extrabold">Nomor WhatsApp (JID)</th>
                    <th className="py-3.5 px-3 font-extrabold">Tenant ID</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Trust &amp; Warmup</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Kirim Hari Ini</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Status Live</th>
                    <th className="py-3.5 px-5 font-extrabold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs font-semibold">
                  {devices.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/30 transition-colors group">
                      {/* 1. Nama & ID */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground text-xs block">
                            {d.pushName}
                          </span>
                          <span className="font-mono text-[10px] text-foreground-muted block">
                            {d.id.slice(0, 16)}...
                          </span>
                        </div>
                      </td>

                      {/* 2. Nomor / WhatsApp JID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-foreground font-bold">
                          <Smartphone className="size-3 text-foreground-muted shrink-0" />
                          <span className="truncate max-w-45">{d.jid || "(Belum terhubung)"}</span>
                        </div>
                      </td>

                      {/* 3. Tenant ID */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[11px] text-foreground-secondary block truncate max-w-28">
                          {d.tenantId}
                        </span>
                      </td>

                      {/* 4. Trust & Warmup */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-2 font-mono text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-wise-green font-bold">
                            {d.trustScore}/100
                          </span>
                          <span className="text-foreground-muted font-semibold">
                            H-{d.warmupDay}
                          </span>
                        </div>
                      </td>

                      {/* 5. Kirim Hari Ini */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                          {d.dailySentCount}
                        </span>
                      </td>

                      {/* 6. Status Live */}
                      <td className="py-3.5 px-3 text-center">{getDeviceStatusBadge(d.status)}</td>

                      {/* 7. Aksi */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(d)}
                            className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:bg-muted cursor-pointer"
                            title="Lihat Detail Perangkat"
                          >
                            <Eye className="size-3.5 text-foreground-secondary" />
                            <span>Detail</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(d)}
                            className="h-8 size-8 p-0 rounded-full border-border hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-600 cursor-pointer"
                            title="Hapus Perangkat"
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
                <strong className="text-foreground">{total}</strong> perangkat
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

      {/* Delete Device Modal */}
      <DeleteDeviceModal
        device={selectedDeviceForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (selectedDeviceForDelete) {
            await onDelete(selectedDeviceForDelete.id);
          }
        }}
      />

      {/* Device Detail Modal */}
      <DeviceDetailModal
        device={selectedDeviceForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
