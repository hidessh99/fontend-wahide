"use client";

import React, { useState } from "react";
import { useAdminBilling } from "@/modules/admin/hooks/useAdminBilling";
import { AdminBillingItem } from "@/modules/admin/types/admin.types";
import { UpdateBillingStatusModal } from "./UpdateBillingStatusModal";
import { DeleteBillingModal } from "./DeleteBillingModal";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import {
  Search,
  X,
  RefreshCw,
  Receipt,
  CheckCircle2,
  Clock,
  Ban,
  AlertCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";

function getStatusBadge(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "PAID":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20">
          <CheckCircle2 className="size-3" />
          <span>Lunas (PAID)</span>
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <Clock className="size-3" />
          <span>Menunggu</span>
        </span>
      );
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <RotateCcw className="size-3" />
          <span>Diproses</span>
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
          <AlertCircle className="size-3" />
          <span>Kadaluarsa</span>
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <Ban className="size-3" />
          <span>Dibatalkan</span>
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

function formatPaymentMethod(method: string) {
  const upper = (method || "").toUpperCase();
  if (upper.includes("QRIS")) return "QRIS";
  if (upper.includes("TRIPAY")) return "Tripay Gateway";
  if (upper.includes("DUITKU")) return "Duitku Gateway";
  if (upper.includes("MIDTRANS")) return "Midtrans Gateway";
  if (upper.includes("XENDIT")) return "Xendit Gateway";
  if (upper.includes("MANUAL")) return "Transfer Manual";
  return method || "Payment Gateway";
}

export function BillingManagementTable() {
  const {
    billings,
    isLoading,
    searchQuery,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    updateStatus,
    deleteBilling,
    executeSearch,
    clearSearch,
    setStatusFilter,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    fetchBillings,
  } = useAdminBilling();

  const [searchInput, setSearchInput] = useState("");
  const [selectedBillingForStatus, setSelectedBillingForStatus] = useState<AdminBillingItem | null>(null);
  const [selectedBillingForDelete, setSelectedBillingForDelete] = useState<AdminBillingItem | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenStatusModal = (b: AdminBillingItem) => {
    setSelectedBillingForStatus(b);
    setIsStatusModalOpen(true);
  };

  const handleOpenDeleteModal = (b: AdminBillingItem) => {
    setSelectedBillingForDelete(b);
    setIsDeleteModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    clearSearch();
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
    <div className="space-y-6">
      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Lunas</span>
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-wise-green">
            Rp {metrics.paidTotal.toLocaleString("id-ID")}
          </div>
          <span className="text-[10px] text-foreground-muted">Transaksi berstatus PAID</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Menunggu Bayar</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-amber-600 dark:text-amber-400">
            {metrics.pendingCount} Tagihan
          </div>
          <span className="text-[10px] text-foreground-muted">Perlu rekonsiliasi gateway</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Batal / Kadaluarsa</span>
            <Ban className="size-4 text-rose-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-rose-600 dark:text-rose-400">
            {metrics.closedCount} Tagihan
          </div>
          <span className="text-[10px] text-foreground-muted">Expired &amp; Cancelled</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Transaksi</span>
            <Receipt className="size-4 text-foreground-secondary" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-foreground">
            {total} Transaksi
          </div>
          <span className="text-[10px] text-foreground-muted">Keseluruhan entri billing</span>
        </div>
      </div>

      {/* Search & Status Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan ID transaksi, nama pengguna, email, atau metode..."
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
          <div className="flex items-center gap-2 shrink-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-emerald-600 dark:focus:border-wise-green cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="ALL">Semua Status</option>
              <option value="PAID">🟢 PAID (Lunas)</option>
              <option value="PENDING">🟡 PENDING (Menunggu)</option>
              <option value="PROCESSING">🔵 PROCESSING (Diproses)</option>
              <option value="EXPIRED">⚪ EXPIRED (Kadaluarsa)</option>
              <option value="CANCELLED">🔴 CANCELLED (Dibatalkan)</option>
            </select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBillings}
              disabled={isLoading}
              className="rounded-full size-10 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0"
              aria-label="Refresh Data Billing"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Billings Data Table & Mobile View */}
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-foreground-muted">
            <Loader2 className="size-7 animate-spin text-emerald-600 dark:text-wise-green" />
            <span className="text-xs font-bold">Memuat daftar transaksi billing &amp; topup...</span>
          </div>
        ) : billings.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Receipt className="size-8 mx-auto text-foreground-muted" />
            <div className="text-xs font-bold text-foreground">Tidak Ada Transaksi Ditemukan</div>
            <p className="text-[11px] text-foreground-muted max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}".`
                : "Belum ada riwayat transaksi billing atau topup saldo pada sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="lg:hidden divide-y divide-border/60">
              {billings.map((b) => {
                const canChangeStatus = b.status === "PENDING" || b.status === "PROCESSING";

                return (
                  <div key={b.id} className="p-4 space-y-3 bg-surface dark:bg-[#161715]">
                    {/* Header: User & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-9 rounded-full bg-muted flex items-center justify-center font-black text-xs text-foreground shrink-0 uppercase border border-border">
                          {b.user?.name ? b.user.name.charAt(0) : "U"}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-sm text-foreground block truncate">
                            {b.user?.name || `User ${b.userId.slice(-6)}`}
                          </span>
                          <span className="text-[11px] text-foreground-muted font-mono block truncate">
                            {b.user?.email || b.userId}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">{getStatusBadge(b.status)}</div>
                    </div>

                    {/* Amount & Method Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/50 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                          Nominal Topup
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-wise-green text-sm">
                          Rp {b.amount.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                          Metode Bayar
                        </span>
                        <span className="font-semibold text-foreground text-xs">
                          {formatPaymentMethod(b.method)}
                        </span>
                      </div>
                    </div>

                    {/* Reference & Date */}
                    <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1">
                      <span className="font-mono">ID: {b.id.slice(0, 16)}...</span>
                      <span>{formatDateTime(b.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-border/50 flex items-center justify-end gap-2">
                      {b.invoiceUrl && (
                        <a
                          href={b.invoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="h-8 px-2.5 rounded-full border border-border text-xs font-bold flex items-center gap-1 text-foreground-secondary hover:text-foreground hover:bg-muted transition"
                        >
                          <ExternalLink className="size-3" />
                          <span>Invoice</span>
                        </a>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenStatusModal(b)}
                        disabled={!canChangeStatus}
                        className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:bg-muted disabled:opacity-40"
                        title={
                          canChangeStatus
                            ? "Tandai Expired atau Batalkan"
                            : "Status transaksi sudah final"
                        }
                      >
                        <Ban className="size-3.5 text-rose-500" />
                        <span>Tutup / Batal</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDeleteModal(b)}
                        className="h-8 size-8 p-0 rounded-full border-border hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-600"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
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
                    <th className="py-3.5 px-5 font-extrabold">ID Transaksi</th>
                    <th className="py-3.5 px-4 font-extrabold">Pengguna / Seller</th>
                    <th className="py-3.5 px-4 font-extrabold text-right">Nominal Topup</th>
                    <th className="py-3.5 px-4 font-extrabold">Metode Pembayaran</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Status</th>
                    <th className="py-3.5 px-4 font-extrabold">Tanggal Transaksi</th>
                    <th className="py-3.5 px-5 font-extrabold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs font-semibold">
                  {billings.map((b) => {
                    const canChangeStatus = b.status === "PENDING" || b.status === "PROCESSING";

                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* 1. ID Transaksi */}
                        <td className="py-3.5 px-5 font-mono text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground">{b.id.slice(0, 16)}</span>
                            {b.invoiceUrl && (
                              <a
                                href={b.invoiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-foreground-muted hover:text-emerald-600 dark:hover:text-wise-green"
                                title="Buka Halaman Checkout Invoice"
                              >
                                <ExternalLink className="size-3" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* 2. Pengguna / Seller */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full bg-muted flex items-center justify-center font-black text-xs text-foreground shrink-0 uppercase border border-border">
                              {b.user?.name ? b.user.name.charAt(0) : "U"}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-foreground text-sm truncate block max-w-[160px]">
                                {b.user?.name || `User ${b.userId.slice(-6)}`}
                              </span>
                              <span className="text-[11px] text-foreground-muted font-mono truncate block max-w-[160px]">
                                {b.user?.email || b.userId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Nominal Topup */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          <span className="text-emerald-700 dark:text-wise-green text-sm">
                            Rp {b.amount.toLocaleString("id-ID")}
                          </span>
                        </td>

                        {/* 4. Metode Pembayaran */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-foreground font-semibold">
                            <CreditCard className="size-3.5 text-foreground-muted shrink-0" />
                            <span>{formatPaymentMethod(b.method)}</span>
                          </div>
                        </td>

                        {/* 5. Status Pembayaran */}
                        <td className="py-3.5 px-3 text-center">{getStatusBadge(b.status)}</td>

                        {/* 6. Tanggal Transaksi */}
                        <td className="py-3.5 px-4 text-foreground-secondary font-mono text-[11px]">
                          {formatDateTime(b.createdAt)}
                        </td>

                        {/* 7. Aksi */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenStatusModal(b)}
                              disabled={!canChangeStatus}
                              className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-rose-500/50 hover:bg-rose-500/10 disabled:opacity-40"
                              title={
                                canChangeStatus
                                  ? "Tandai Expired atau Batalkan"
                                  : "Status transaksi sudah final"
                              }
                            >
                              <Ban className="size-3.5 text-rose-500" />
                              <span>Batal / Expired</span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDeleteModal(b)}
                              className="h-8 size-8 p-0 rounded-full border-border hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-600"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
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
            {/* Item count summary & Page size selector */}
            <div className="flex items-center gap-3 text-xs font-semibold text-foreground-secondary">
              <span>
                Menampilkan <strong className="text-foreground">{startItem} - {endItem}</strong> dari{" "}
                <strong className="text-foreground">{total}</strong> transaksi billing
              </span>

              <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <span>| Baris:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-7 px-2 rounded-md bg-surface dark:bg-[#10110e] border border-border text-foreground font-bold text-xs outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Page navigation buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={page <= 1}
                className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>

              {/* Numbered Page Buttons */}
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
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
                onClick={nextPage}
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

      {/* Update Billing Status Modal */}
      <UpdateBillingStatusModal
        billing={selectedBillingForStatus}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={updateStatus}
      />

      {/* Delete Billing Confirmation Modal */}
      <DeleteBillingModal
        billing={selectedBillingForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (selectedBillingForDelete) {
            await deleteBilling(selectedBillingForDelete.id);
          }
        }}
      />
    </div>
  );
}
