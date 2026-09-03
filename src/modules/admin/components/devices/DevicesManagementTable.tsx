"use client";

import React, { useState } from "react";
import { AdminDeviceItem } from "@/modules/admin/types/admin.types";
import { DeleteDeviceModal } from "./DeleteDeviceModal";
import { DeviceDetailModal } from "./DeviceDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { DataTablePagination } from "@/components/ui/pagination";
import { formatDateTime } from "@/lib/utils";
import {
  Search,
  X,
  RefreshCw,
  Smartphone,
  Trash2,
  Eye,
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
        <Badge variant="success">
          <Wifi className="size-3" />
          <span>Online</span>
        </Badge>
      );
    case "OFFLINE":
      return (
        <Badge variant="neutral">
          <WifiOff className="size-3" />
          <span>Offline</span>
        </Badge>
      );
    case "QR_PENDING":
      return (
        <Badge variant="warning">
          <QrCode className="size-3" />
          <span>Scan QR</span>
        </Badge>
      );
    case "HIBERNATED":
      return (
        <Badge variant="info">
          <Moon className="size-3" />
          <span>Hibernasi</span>
        </Badge>
      );
    case "BANNED":
      return (
        <Badge variant="danger">
          <Ban className="size-3" />
          <span>Banned</span>
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
  const [selectedDeviceForDelete, setSelectedDeviceForDelete] = useState<AdminDeviceItem | null>(
    null
  );
  const [selectedDeviceForDetail, setSelectedDeviceForDetail] = useState<AdminDeviceItem | null>(
    null
  );
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
                placeholder="Cari berdasarkan nama perangkat, nomor WhatsApp, ID, atau Tenant..."
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

          {/* Filter Status & Refresh */}
          <div className="flex shrink-0 items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-surface text-foreground border-border dark:focus:border-wise-green h-10 cursor-pointer rounded-full border px-3.5 text-xs font-semibold outline-none focus:border-emerald-600 dark:bg-[#10110e]"
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
              className="border-border hover:border-foreground-muted size-10 shrink-0 cursor-pointer rounded-full p-0"
              aria-label="Refresh Data Perangkat"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Devices Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">Memuat data perangkat WhatsApp...</span>
          </div>
        ) : devices.length === 0 ? (
          <EmptyState
            icon={<Smartphone />}
            title="Tidak Ada Perangkat Ditemukan"
            description={
              searchQuery
                ? `Tidak ditemukan perangkat dengan kata kunci "${searchQuery}".`
                : "Saat ini belum ada perangkat WhatsApp yang terdaftar di sistem."
            }
          />
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {devices.map((d) => (
                <div key={d.id} className="bg-surface space-y-3 p-4 dark:bg-[#161715]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-bold">{d.pushName}</span>
                      </div>
                      <span className="text-foreground-secondary block font-mono text-xs font-bold">
                        {d.jid || "(Belum terhubung)"}
                      </span>
                    </div>

                    <div className="shrink-0">{getDeviceStatusBadge(d.status)}</div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="border-border bg-muted/20 grid grid-cols-3 gap-2 rounded-lg border p-2.5 text-center text-xs">
                    <div>
                      <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                        Trust
                      </span>
                      <span className="text-foreground font-mono font-bold">
                        {d.trustScore}/100
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                        Warmup
                      </span>
                      <span className="text-foreground font-mono font-bold">H-{d.warmupDay}</span>
                    </div>
                    <div>
                      <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                        Terkirim
                      </span>
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                        {d.dailySentCount}
                      </span>
                    </div>
                  </div>

                  <div className="text-foreground-muted flex items-center justify-between pt-1 text-[11px]">
                    <span className="max-w-30 truncate font-mono text-[10px]">
                      Ten: {d.tenantId.slice(0, 10)}...
                    </span>
                    <span>{formatDateTime(d.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(d)}
                      className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                    >
                      <Eye className="size-3.5" />
                      <span>Detail</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDelete(d)}
                      className="border-border size-8 h-8 cursor-pointer rounded-full p-0 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                      title="Hapus Perangkat"
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
                    <th className="px-5 py-3.5 font-extrabold">Nama &amp; ID Perangkat</th>
                    <th className="px-4 py-3.5 font-extrabold">Nomor WhatsApp (JID)</th>
                    <th className="px-3 py-3.5 font-extrabold">Tenant ID</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Trust &amp; Warmup</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Kirim Hari Ini</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Status Live</th>
                    <th className="px-5 py-3.5 text-right font-extrabold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y text-xs font-semibold">
                  {devices.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/30 group transition-colors">
                      {/* 1. Nama & ID */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <span className="text-foreground block text-xs font-bold">
                            {d.pushName}
                          </span>
                          <span className="text-foreground-muted block font-mono text-[10px]">
                            {d.id.slice(0, 16)}...
                          </span>
                        </div>
                      </td>

                      {/* 2. Nomor / WhatsApp JID */}
                      <td className="px-4 py-3.5">
                        <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold">
                          <Smartphone className="text-foreground-muted size-3 shrink-0" />
                          <span className="max-w-45 truncate">{d.jid || "(Belum terhubung)"}</span>
                        </div>
                      </td>

                      {/* 3. Tenant ID */}
                      <td className="px-3 py-3.5">
                        <span className="text-foreground-secondary block max-w-28 truncate font-mono text-[11px]">
                          {d.tenantId}
                        </span>
                      </td>

                      {/* 4. Trust & Warmup */}
                      <td className="px-3 py-3.5 text-center">
                        <div className="inline-flex items-center gap-2 font-mono text-[11px]">
                          <span className="dark:text-wise-green rounded bg-emerald-500/10 px-1.5 py-0.5 font-bold text-emerald-700">
                            {d.trustScore}/100
                          </span>
                          <span className="text-foreground-muted font-semibold">
                            H-{d.warmupDay}
                          </span>
                        </div>
                      </td>

                      {/* 5. Kirim Hari Ini */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                          {d.dailySentCount}
                        </span>
                      </td>

                      {/* 6. Status Live */}
                      <td className="px-3 py-3.5 text-center">{getDeviceStatusBadge(d.status)}</td>

                      {/* 7. Aksi */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(d)}
                            className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                            title="Lihat Detail Perangkat"
                          >
                            <Eye className="text-foreground-secondary size-3.5" />
                            <span>Detail</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(d)}
                            className="border-border size-8 h-8 cursor-pointer rounded-full p-0 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
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
          <div className="border-border bg-muted/20 flex flex-col items-center justify-between gap-3 border-t p-3.5 sm:flex-row sm:px-5 sm:py-3.5">
            <div className="text-foreground-secondary flex items-center gap-3 text-xs font-semibold">
              <span>
                Menampilkan{" "}
                <strong className="text-foreground">
                  {startItem} - {endItem}
                </strong>{" "}
                dari <strong className="text-foreground">{total}</strong> perangkat
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
