"use client";

import React, { useState } from "react";
import { useAdminBilling } from "@/modules/admin/hooks/useAdminBilling";
import { AdminBillingItem } from "@/modules/admin/types/admin.types";
import { UpdateBillingStatusModal } from "./UpdateBillingStatusModal";
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
  Loader2,
  ExternalLink,
} from "lucide-react";

function getStatusBadge(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "PAID":
      return (
        <span className="dark:text-wise-green inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-emerald-700 uppercase">
          <CheckCircle2 className="size-3" />
          <span>Lunas (PAID)</span>
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
          <RotateCcw className="size-3" />
          <span>Diproses</span>
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
          <AlertCircle className="size-3" />
          <span>Kadaluarsa</span>
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-rose-600 uppercase dark:text-rose-400">
          <Ban className="size-3" />
          <span>Dibatalkan</span>
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
  const [selectedBillingForStatus, setSelectedBillingForStatus] = useState<AdminBillingItem | null>(
    null
  );
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleOpenStatusModal = (b: AdminBillingItem) => {
    setSelectedBillingForStatus(b);
    setIsStatusModalOpen(true);
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
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">Total Lunas</span>
            <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-600" />
          </div>
          <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
            Rp {metrics.paidTotal.toLocaleString("id-ID")}
          </div>
          <span className="text-foreground-muted text-[10px]">Transaksi berstatus PAID</span>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">Menunggu Bayar</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="font-mono text-lg font-black text-amber-600 sm:text-xl dark:text-amber-400">
            {metrics.pendingCount} Tagihan
          </div>
          <span className="text-foreground-muted text-[10px]">Perlu rekonsiliasi gateway</span>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              Batal / Kadaluarsa
            </span>
            <Ban className="size-4 text-rose-500" />
          </div>
          <div className="font-mono text-lg font-black text-rose-600 sm:text-xl dark:text-rose-400">
            {metrics.closedCount} Tagihan
          </div>
          <span className="text-foreground-muted text-[10px]">Expired &amp; Cancelled</span>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">Total Transaksi</span>
            <Receipt className="text-foreground-secondary size-4" />
          </div>
          <div className="text-foreground font-mono text-lg font-black sm:text-xl">
            {total} Transaksi
          </div>
          <span className="text-foreground-muted text-[10px]">Keseluruhan entri billing</span>
        </div>
      </div>

      {/* Search & Status Filter Toolbar */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan ID transaksi, nama pengguna, email, atau metode..."
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
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface text-foreground border-border dark:focus:border-wise-green h-10 flex-1 cursor-pointer rounded-full border px-3.5 text-xs font-semibold outline-none focus:border-emerald-600 sm:flex-initial dark:bg-[#10110e]"
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
              className="border-border hover:border-foreground-muted size-10 shrink-0 cursor-pointer rounded-full p-0"
              aria-label="Refresh Data Billing"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Billings Data Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">
              Memuat daftar transaksi billing &amp; topup...
            </span>
          </div>
        ) : billings.length === 0 ? (
          <div className="space-y-2 p-10 text-center">
            <Receipt className="text-foreground-muted mx-auto size-8" />
            <div className="text-foreground text-xs font-bold">Tidak Ada Transaksi Ditemukan</div>
            <p className="text-foreground-muted mx-auto max-w-sm text-[11px]">
              {searchQuery
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}".`
                : "Belum ada riwayat transaksi billing atau topup saldo pada sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {billings.map((b) => {
                const canChangeStatus = b.status === "PENDING" || b.status === "PROCESSING";

                return (
                  <div key={b.id} className="bg-surface space-y-3 p-4 dark:bg-[#161715]">
                    {/* Header: User & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="bg-muted text-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-black uppercase">
                          {b.user?.name ? b.user.name.charAt(0) : "U"}
                        </div>
                        <div className="min-w-0">
                          <span className="text-foreground block truncate text-sm font-bold">
                            {b.user?.name || `User ${b.userId.slice(-6)}`}
                          </span>
                          <span className="text-foreground-muted block truncate font-mono text-[11px]">
                            {b.user?.email || b.userId}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">{getStatusBadge(b.status)}</div>
                    </div>

                    {/* Amount & Method Grid */}
                    <div className="bg-muted/20 border-border/50 grid grid-cols-2 gap-2 rounded-lg border p-2.5 text-xs">
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          Nominal Topup
                        </span>
                        <span className="dark:text-wise-green font-mono text-sm font-bold text-emerald-700">
                          Rp {b.amount.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          Metode Bayar
                        </span>
                        <span className="text-foreground text-xs font-semibold">
                          {formatPaymentMethod(b.method)}
                        </span>
                      </div>
                    </div>

                    {/* Reference & Date */}
                    <div className="text-foreground-muted flex items-center justify-between pt-1 text-[11px]">
                      <span className="font-mono">ID: {b.id.slice(0, 16)}...</span>
                      <span>{formatDateTime(b.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-2">
                      {b.invoiceUrl && (
                        <a
                          href={b.invoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="border-border text-foreground-secondary hover:text-foreground hover:bg-muted flex h-8 items-center gap-1 rounded-full border px-2.5 text-xs font-bold transition"
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
                        className="border-border hover:bg-muted h-8 gap-1 rounded-full px-3 text-xs font-bold disabled:opacity-40"
                        title={
                          canChangeStatus
                            ? "Tandai Expired atau Batalkan"
                            : "Status transaksi sudah final"
                        }
                      >
                        <Ban className="size-3.5 text-rose-500" />
                        <span>Tutup / Batal</span>
                      </Button>
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
                    <th className="px-5 py-3.5 font-extrabold">ID Transaksi</th>
                    <th className="px-4 py-3.5 font-extrabold">Pengguna / Seller</th>
                    <th className="px-4 py-3.5 text-right font-extrabold">Nominal Topup</th>
                    <th className="px-4 py-3.5 font-extrabold">Metode Pembayaran</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Status</th>
                    <th className="px-4 py-3.5 font-extrabold">Tanggal Transaksi</th>
                    <th className="px-5 py-3.5 text-right font-extrabold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y text-xs font-semibold">
                  {billings.map((b) => {
                    const canChangeStatus = b.status === "PENDING" || b.status === "PROCESSING";

                    return (
                      <tr key={b.id} className="hover:bg-muted/30 group transition-colors">
                        {/* 1. ID Transaksi */}
                        <td className="px-5 py-3.5 font-mono text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground font-bold">{b.id.slice(0, 16)}</span>
                            {b.invoiceUrl && (
                              <a
                                href={b.invoiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-foreground-muted dark:text-wise-green hover:text-emerald-600"
                                title="Buka Halaman Checkout Invoice"
                              >
                                <ExternalLink className="size-3" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* 2. Pengguna / Seller */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-muted text-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-black uppercase">
                              {b.user?.name ? b.user.name.charAt(0) : "U"}
                            </div>
                            <div className="min-w-0">
                              <span className="text-foreground block max-w-40 truncate text-sm font-bold">
                                {b.user?.name || `User ${b.userId.slice(-6)}`}
                              </span>
                              <span className="text-foreground-muted block max-w-40 truncate font-mono text-[11px]">
                                {b.user?.email || b.userId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Nominal Topup */}
                        <td className="px-4 py-3.5 text-right font-mono font-bold">
                          <span className="dark:text-wise-green text-sm text-emerald-700">
                            Rp {b.amount.toLocaleString("id-ID")}
                          </span>
                        </td>

                        {/* 4. Metode Pembayaran */}
                        <td className="px-4 py-3.5">
                          <div className="text-foreground flex items-center gap-1.5 font-semibold">
                            <CreditCard className="text-foreground-muted size-3.5 shrink-0" />
                            <span>{formatPaymentMethod(b.method)}</span>
                          </div>
                        </td>

                        {/* 5. Status Pembayaran */}
                        <td className="px-3 py-3.5 text-center">{getStatusBadge(b.status)}</td>

                        {/* 6. Tanggal Transaksi */}
                        <td className="text-foreground-secondary px-4 py-3.5 font-mono text-[11px]">
                          {formatDateTime(b.createdAt)}
                        </td>

                        {/* 7. Aksi */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenStatusModal(b)}
                              disabled={!canChangeStatus}
                              className="border-border h-8 gap-1.5 rounded-full px-3 text-xs font-bold hover:border-rose-500/50 hover:bg-rose-500/10 disabled:opacity-40"
                              title={
                                canChangeStatus
                                  ? "Tandai Expired atau Batalkan"
                                  : "Status transaksi sudah final"
                              }
                            >
                              <Ban className="size-3.5 text-rose-500" />
                              <span>Batal / Expired</span>
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
          <div className="border-border bg-muted/20 flex flex-col items-center justify-between gap-3 border-t p-3.5 sm:flex-row sm:px-5 sm:py-3.5">
            {/* Item count summary & Page size selector */}
            <div className="text-foreground-secondary flex items-center gap-3 text-xs font-semibold">
              <span>
                Menampilkan{" "}
                <strong className="text-foreground">
                  {startItem} - {endItem}
                </strong>{" "}
                dari <strong className="text-foreground">{total}</strong> transaksi billing
              </span>

              <div className="text-foreground-muted flex items-center gap-1.5 text-xs">
                <span>| Baris:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-surface border-border text-foreground h-7 cursor-pointer rounded-md border px-2 text-xs font-bold outline-none dark:bg-[#10110e]"
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
                className="border-border hover:border-foreground-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold disabled:opacity-40"
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
                onClick={nextPage}
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

      {/* Update Billing Status Modal */}
      <UpdateBillingStatusModal
        billing={selectedBillingForStatus}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={updateStatus}
      />
    </div>
  );
}
