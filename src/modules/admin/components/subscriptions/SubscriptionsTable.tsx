"use client";

import React, { useState } from "react";
import { AdminSubscriptionItem } from "@/modules/admin/types/admin.types";
import { ExpireSubscriptionModal } from "./ExpireSubscriptionModal";
import { SubscriptionDetailModal } from "./SubscriptionDetailModal";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/pagination";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Search,
  X,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Sparkles,
  Ban,
  Building2,
} from "lucide-react";

interface SubscriptionsTableProps {
  subscriptions: AdminSubscriptionItem[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onRefresh: () => void;
  onExpire: (id: string) => Promise<unknown>;
  onSearch: (q: string) => void;
  onClearSearch: () => void;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

function getSubscriptionStatusBadge(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ACTIVE":
      return (
        <span className="dark:text-wise-green inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-emerald-700 uppercase">
          <CheckCircle2 className="size-3" />
          <span>Aktif</span>
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-rose-600 uppercase dark:text-rose-400">
          <Clock className="size-3" />
          <span>Expired</span>
        </span>
      );
    case "TRIAL":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-amber-700 uppercase dark:text-amber-400">
          <Sparkles className="size-3" />
          <span>Trial</span>
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
          <Ban className="size-3" />
          <span>Suspended</span>
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

export function SubscriptionsTable({
  subscriptions,
  isLoading,
  searchQuery,
  statusFilter,
  page,
  pageSize,
  total,
  totalPages,
  onRefresh,
  onExpire,
  onSearch,
  onClearSearch,
  onStatusFilterChange,
  onPageChange,
  onPageSizeChange,
  onNextPage,
  onPrevPage,
}: SubscriptionsTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedSubForExpire, setSelectedSubForExpire] = useState<AdminSubscriptionItem | null>(
    null
  );
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<AdminSubscriptionItem | null>(
    null
  );
  const [isExpireModalOpen, setIsExpireModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    onClearSearch();
  };

  const handleOpenExpire = (s: AdminSubscriptionItem) => {
    setSelectedSubForExpire(s);
    setIsExpireModalOpen(true);
  };

  const handleOpenDetail = (s: AdminSubscriptionItem) => {
    setSelectedSubForDetail(s);
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
                placeholder="Cari berdasarkan nama tenant, ID, atau nama paket..."
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
              <option value="ACTIVE">🟢 Aktif (ACTIVE)</option>
              <option value="EXPIRED">🔴 Expired (EXPIRED)</option>
              <option value="TRIAL">🟡 Masa Uji Coba (TRIAL)</option>
              <option value="SUSPENDED">⚪ Suspended</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted size-10 shrink-0 cursor-pointer rounded-full p-0"
              aria-label="Refresh Data Langganan"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Subscriptions Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">Memuat data paket langganan pengguna...</span>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="space-y-2 p-10 text-center">
            <CreditCard className="text-foreground-muted mx-auto size-8" />
            <div className="text-foreground text-xs font-bold">Tidak Ada Langganan Ditemukan</div>
            <p className="text-foreground-muted mx-auto max-w-sm text-[11px]">
              {searchQuery
                ? `Tidak ditemukan langganan dengan kata kunci "${searchQuery}".`
                : "Saat ini belum ada data langganan yang tercatat di sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {subscriptions.map((s) => {
                const planName = s.plan?.name || `Plan ${s.planId.slice(0, 8)}`;
                const tenantName = s.tenant?.name || s.tenantId;
                const quotaLimit = s.plan?.monthly_message_limit ?? 1000;
                const usagePercent = Math.min(
                  100,
                  Math.round((s.currentMonthUsage / (quotaLimit || 1)) * 100)
                );
                const isExpired = s.status === "EXPIRED";

                return (
                  <div key={s.id} className="bg-surface space-y-3 p-4 dark:bg-[#161715]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-foreground text-sm font-bold">{tenantName}</span>
                        <span className="text-foreground-secondary block font-mono text-xs font-bold">
                          {planName} &bull; {formatCurrency(s.plan?.price ?? 0)}
                        </span>
                      </div>

                      <div className="shrink-0">{getSubscriptionStatusBadge(s.status)}</div>
                    </div>

                    {/* Quota Progress */}
                    <div className="bg-muted/20 border-border/60 space-y-1 rounded-lg border p-2.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-foreground-muted font-semibold">
                          Penggunaan Kuota:
                        </span>
                        <span className="text-foreground font-mono font-bold">
                          {s.currentMonthUsage} / {quotaLimit} ({usagePercent}%)
                        </span>
                      </div>
                      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className="dark:bg-wise-green h-full rounded-full bg-emerald-600"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-foreground-muted flex items-center justify-between pt-1 text-[11px]">
                      <span>Berakhir: {formatDateTime(s.expiredAt)}</span>
                      <span className="font-mono text-[10px]">ID: {s.id.slice(0, 10)}...</span>
                    </div>

                    {/* Actions */}
                    <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetail(s)}
                        className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                      >
                        <Eye className="size-3.5" />
                        <span>Detail</span>
                      </Button>

                      {!isExpired && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenExpire(s)}
                          className="h-8 cursor-pointer gap-1 rounded-full border-amber-500/30 px-2.5 text-xs font-bold text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                          title="Tandai Expired"
                        >
                          <Clock className="size-3.5" />
                          <span>Set Expired</span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 1024px) */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border bg-muted/50 text-foreground-muted border-b text-[11px] font-extrabold tracking-wider uppercase select-none">
                    <th className="px-5 py-3.5 font-extrabold">Tenant &amp; ID Langganan</th>
                    <th className="px-4 py-3.5 font-extrabold">Paket Langganan</th>
                    <th className="px-4 py-3.5 font-extrabold">Penggunaan Kuota</th>
                    <th className="px-4 py-3.5 font-extrabold">Masa Berlaku</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Status</th>
                    <th className="px-3 py-3.5 font-extrabold">Dibuat Pada</th>
                    <th className="px-5 py-3.5 text-right font-extrabold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y text-xs font-semibold">
                  {subscriptions.map((s) => {
                    const planName = s.plan?.name || `Plan ${s.planId.slice(0, 8)}`;
                    const tenantName = s.tenant?.name || s.tenantId;
                    const quotaLimit = s.plan?.monthly_message_limit ?? 1000;
                    const usagePercent = Math.min(
                      100,
                      Math.round((s.currentMonthUsage / (quotaLimit || 1)) * 100)
                    );
                    const isExpired = s.status === "EXPIRED";

                    return (
                      <tr key={s.id} className="hover:bg-muted/30 group transition-colors">
                        {/* 1. Tenant & ID */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-0.5">
                            <div className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                              <Building2 className="text-foreground-muted size-3 shrink-0" />
                              <span className="max-w-40 truncate">{tenantName}</span>
                            </div>
                            <span className="text-foreground-muted block pl-4.5 font-mono text-[10px]">
                              {s.id.slice(0, 16)}...
                            </span>
                          </div>
                        </td>

                        {/* 2. Paket */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5">
                            <span className="text-foreground block font-bold">{planName}</span>
                            <span className="dark:text-wise-green block font-mono text-[11px] text-emerald-700">
                              {formatCurrency(s.plan?.price ?? 0)}
                            </span>
                          </div>
                        </td>

                        {/* 3. Penggunaan Kuota */}
                        <td className="max-w-xs px-4 py-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between font-mono text-[11px]">
                              <span className="text-foreground font-bold">
                                {s.currentMonthUsage.toLocaleString("id-ID")}
                              </span>
                              <span className="text-foreground-muted">
                                / {quotaLimit.toLocaleString("id-ID")}
                              </span>
                            </div>
                            <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                              <div
                                className="dark:bg-wise-green h-full rounded-full bg-emerald-600"
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 4. Masa Berlaku */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <span className="text-foreground-muted block text-[10px]">
                              Mulai: {formatDateTime(s.startedAt)}
                            </span>
                            <span className="text-foreground block font-bold">
                              Hingga: {formatDateTime(s.expiredAt)}
                            </span>
                          </div>
                        </td>

                        {/* 5. Status */}
                        <td className="px-3 py-3.5 text-center">
                          {getSubscriptionStatusBadge(s.status)}
                        </td>

                        {/* 6. Dibuat Pada */}
                        <td className="px-3 py-3.5">
                          <span className="text-foreground-secondary block font-mono text-[11px]">
                            {formatDateTime(s.createdAt)}
                          </span>
                        </td>

                        {/* 7. Aksi */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDetail(s)}
                              className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                              title="Lihat Detail Langganan"
                            >
                              <Eye className="text-foreground-secondary size-3.5" />
                              <span>Detail</span>
                            </Button>

                            {!isExpired && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenExpire(s)}
                                className="h-8 cursor-pointer gap-1 rounded-full border-amber-500/30 px-2.5 text-xs font-bold text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                                title="Ubah Status Menjadi Expired"
                              >
                                <Clock className="size-3.5" />
                                <span>Set Expired</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                dari <strong className="text-foreground">{total}</strong> langganan
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

      {/* Expire Subscription Modal */}
      <ExpireSubscriptionModal
        subscription={selectedSubForExpire}
        isOpen={isExpireModalOpen}
        onClose={() => setIsExpireModalOpen(false)}
        onConfirm={async () => {
          if (selectedSubForExpire) {
            await onExpire(selectedSubForExpire.id);
          }
        }}
      />

      {/* Subscription Detail Modal */}
      <SubscriptionDetailModal
        subscription={selectedSubForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
