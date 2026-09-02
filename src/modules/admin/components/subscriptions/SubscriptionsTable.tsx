"use client";

import React, { useState } from "react";
import { AdminSubscriptionItem } from "@/modules/admin/types/admin.types";
import { ExpireSubscriptionModal } from "./ExpireSubscriptionModal";
import { SubscriptionDetailModal } from "./SubscriptionDetailModal";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Search,
  X,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20">
          <CheckCircle2 className="size-3" />
          <span>Aktif</span>
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <Clock className="size-3" />
          <span>Expired</span>
        </span>
      );
    case "TRIAL":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <Sparkles className="size-3" />
          <span>Trial</span>
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground-secondary border border-border">
          <Ban className="size-3" />
          <span>Suspended</span>
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
  const [selectedSubForExpire, setSelectedSubForExpire] = useState<AdminSubscriptionItem | null>(null);
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<AdminSubscriptionItem | null>(null);
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
                placeholder="Cari berdasarkan nama tenant, ID, atau nama paket..."
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
              className="rounded-full size-10 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0"
              aria-label="Refresh Data Langganan"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Subscriptions Table & Mobile View */}
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-foreground-muted">
            <Loader2 className="size-7 animate-spin text-emerald-600 dark:text-wise-green" />
            <span className="text-xs font-bold">Memuat data paket langganan pengguna...</span>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CreditCard className="size-8 mx-auto text-foreground-muted" />
            <div className="text-xs font-bold text-foreground">Tidak Ada Langganan Ditemukan</div>
            <p className="text-[11px] text-foreground-muted max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ditemukan langganan dengan kata kunci "${searchQuery}".`
                : "Saat ini belum ada data langganan yang tercatat di sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="lg:hidden divide-y divide-border/60">
              {subscriptions.map((s) => {
                const planName = s.plan?.name || `Plan ${s.planId.slice(0, 8)}`;
                const tenantName = s.tenant?.name || s.tenantId;
                const quotaLimit = s.plan?.monthly_message_limit ?? 1000;
                const usagePercent = Math.min(100, Math.round((s.currentMonthUsage / (quotaLimit || 1)) * 100));
                const isExpired = s.status === "EXPIRED";

                return (
                  <div key={s.id} className="p-4 space-y-3 bg-surface dark:bg-[#161715]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm text-foreground">{tenantName}</span>
                        <span className="font-mono text-xs text-foreground-secondary font-bold block">
                          {planName} &bull; {formatCurrency(s.plan?.price ?? 0)}
                        </span>
                      </div>

                      <div className="shrink-0">{getSubscriptionStatusBadge(s.status)}</div>
                    </div>

                    {/* Quota Progress */}
                    <div className="space-y-1 bg-muted/20 p-2.5 rounded-lg border border-border/60 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-foreground-muted font-semibold">Penggunaan Kuota:</span>
                        <span className="font-mono font-bold text-foreground">
                          {s.currentMonthUsage} / {quotaLimit} ({usagePercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-600 dark:bg-wise-green"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1">
                      <span>Berakhir: {formatDateTime(s.expiredAt)}</span>
                      <span className="font-mono text-[10px]">ID: {s.id.slice(0, 10)}...</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-border/50 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetail(s)}
                        className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:bg-muted cursor-pointer"
                      >
                        <Eye className="size-3.5" />
                        <span>Detail</span>
                      </Button>

                      {!isExpired && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenExpire(s)}
                          className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 cursor-pointer"
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
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-[11px] font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                    <th className="py-3.5 px-5 font-extrabold">Tenant &amp; ID Langganan</th>
                    <th className="py-3.5 px-4 font-extrabold">Paket Langganan</th>
                    <th className="py-3.5 px-4 font-extrabold">Penggunaan Kuota</th>
                    <th className="py-3.5 px-4 font-extrabold">Masa Berlaku</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Status</th>
                    <th className="py-3.5 px-3 font-extrabold">Dibuat Pada</th>
                    <th className="py-3.5 px-5 font-extrabold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs font-semibold">
                  {subscriptions.map((s) => {
                    const planName = s.plan?.name || `Plan ${s.planId.slice(0, 8)}`;
                    const tenantName = s.tenant?.name || s.tenantId;
                    const quotaLimit = s.plan?.monthly_message_limit ?? 1000;
                    const usagePercent = Math.min(100, Math.round((s.currentMonthUsage / (quotaLimit || 1)) * 100));
                    const isExpired = s.status === "EXPIRED";

                    return (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors group">
                        {/* 1. Tenant & ID */}
                        <td className="py-3.5 px-5">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                              <Building2 className="size-3 text-foreground-muted shrink-0" />
                              <span className="truncate max-w-40">{tenantName}</span>
                            </div>
                            <span className="font-mono text-[10px] text-foreground-muted block pl-4.5">
                              {s.id.slice(0, 16)}...
                            </span>
                          </div>
                        </td>

                        {/* 2. Paket */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground block">
                              {planName}
                            </span>
                            <span className="font-mono text-[11px] text-emerald-700 dark:text-wise-green block">
                              {formatCurrency(s.plan?.price ?? 0)}
                            </span>
                          </div>
                        </td>

                        {/* 3. Penggunaan Kuota */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-foreground font-bold">{s.currentMonthUsage.toLocaleString("id-ID")}</span>
                              <span className="text-foreground-muted">/ {quotaLimit.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-600 dark:bg-wise-green"
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 4. Masa Berlaku */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <span className="text-foreground-muted block text-[10px]">
                              Mulai: {formatDateTime(s.startedAt)}
                            </span>
                            <span className="font-bold text-foreground block">
                              Hingga: {formatDateTime(s.expiredAt)}
                            </span>
                          </div>
                        </td>

                        {/* 5. Status */}
                        <td className="py-3.5 px-3 text-center">{getSubscriptionStatusBadge(s.status)}</td>

                        {/* 6. Dibuat Pada */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-[11px] text-foreground-secondary block">
                            {formatDateTime(s.createdAt)}
                          </span>
                        </td>

                        {/* 7. Aksi */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDetail(s)}
                              className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:bg-muted cursor-pointer"
                              title="Lihat Detail Langganan"
                            >
                              <Eye className="size-3.5 text-foreground-secondary" />
                              <span>Detail</span>
                            </Button>

                            {!isExpired && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenExpire(s)}
                                className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 cursor-pointer"
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:px-5 sm:py-3.5 border-t border-border bg-muted/20">
            <div className="flex items-center gap-3 text-xs font-semibold text-foreground-secondary">
              <span>
                Menampilkan <strong className="text-foreground">{startItem} - {endItem}</strong> dari{" "}
                <strong className="text-foreground">{total}</strong> langganan
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
