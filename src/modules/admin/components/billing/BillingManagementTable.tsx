"use client";

import React, { useState } from "react";
import { useAdminBilling } from "@/modules/admin/hooks/useAdminBilling";
import { AdminBillingItem } from "@/modules/admin/types/admin.types";
import { UpdateBillingStatusModal } from "./UpdateBillingStatusModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { NativeSelect } from "@/components/ui/native-select";
import { formatDateTime } from "@/lib/utils";
import {
  RefreshCw,
  Receipt,
  CheckCircle2,
  Clock,
  Ban,
  AlertCircle,
  RotateCcw,
  CreditCard,
  Loader2,
  ExternalLink,
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

function getStatusBadge(status: string) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "PAID":
      return (
        <Badge variant="success">
          <CheckCircle2 className="size-3" />
          <span>Lunas (PAID)</span>
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
          <RotateCcw className="size-3" />
          <span>Diproses</span>
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="neutral">
          <AlertCircle className="size-3" />
          <span>Kadaluarsa</span>
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="danger">
          <Ban className="size-3" />
          <span>Dibatalkan</span>
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

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<AdminBillingItem>({
    initialKey: "createdAt",
    initialOrder: "desc",
  });

  const sortedBillings = sortData(billings);

  const handleOpenStatusModal = (b: AdminBillingItem) => {
    setSelectedBillingForStatus(b);
    setIsStatusModalOpen(true);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    clearSearch();
  };

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
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => executeSearch(searchInput.trim())}
            onClear={handleResetSearch}
            placeholder="Cari berdasarkan ID transaksi, nama pengguna, email, atau metode..."
          />

          {/* Filters & Refresh */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Status Filter */}
            <NativeSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              variant="pill"
              wrapperClassName="flex-1 sm:flex-initial"
            >
              <option value="ALL">Semua Status</option>
              <option value="PAID">🟢 PAID (Lunas)</option>
              <option value="PENDING">🟡 PENDING (Menunggu)</option>
              <option value="PROCESSING">🔵 PROCESSING (Diproses)</option>
              <option value="EXPIRED">⚪ EXPIRED (Kadaluarsa)</option>
              <option value="CANCELLED">🔴 CANCELLED (Dibatalkan)</option>
            </NativeSelect>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBillings}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
              aria-label="Refresh Data Billing"
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
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
          <EmptyState
            icon={<Receipt />}
            title="Tidak Ada Transaksi Ditemukan"
            description={
              searchQuery
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}".`
                : "Belum ada riwayat transaksi billing atau topup saldo pada sistem."
            }
          />
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {sortedBillings.map((b) => {
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
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[18%] px-5 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        ID Transaksi
                      </div>
                    </TableHead>
                    <TableHead className="w-[20%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Pengguna / Seller
                      </div>
                    </TableHead>
                    <TableHead className="w-[15%] px-4 py-3.5 text-right">
                      <DataTableColumnHeader
                        title="Nominal Topup"
                        columnKey="amount"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                    </TableHead>
                    <TableHead className="w-[15%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Metode Pembayaran
                      </div>
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
                    <TableHead className="w-[12%] px-4 py-3.5">
                      <DataTableColumnHeader
                        title="Tanggal Transaksi"
                        columnKey="createdAt"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[8%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                        Aksi
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBillings.map((b) => {
                    const canChangeStatus = b.status === "PENDING" || b.status === "PROCESSING";

                    return (
                      <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                        {/* 1. ID Transaksi */}
                        <TableCell className="px-5 py-3.5 align-middle font-mono text-xs">
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
                        </TableCell>

                        {/* 2. Pengguna / Seller */}
                        <TableCell className="px-4 py-3.5 align-middle">
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
                        </TableCell>

                        {/* 3. Nominal Topup */}
                        <TableCell className="px-4 py-3.5 text-right align-middle font-mono font-bold">
                          <span className="dark:text-wise-green text-sm text-emerald-700">
                            Rp {b.amount.toLocaleString("id-ID")}
                          </span>
                        </TableCell>

                        {/* 4. Metode Pembayaran */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="text-foreground flex items-center gap-1.5 font-semibold">
                            <CreditCard className="text-foreground-muted size-3.5 shrink-0" />
                            <span>{formatPaymentMethod(b.method)}</span>
                          </div>
                        </TableCell>

                        {/* 5. Status Pembayaran */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            {getStatusBadge(b.status)}
                          </div>
                        </TableCell>

                        {/* 6. Tanggal Transaksi */}
                        <TableCell className="text-foreground-secondary px-4 py-3.5 align-middle font-mono text-[11px]">
                          {formatDateTime(b.createdAt)}
                        </TableCell>

                        {/* 7. Aksi */}
                        <TableCell className="px-5 py-3.5 text-right align-middle">
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Responsive Pagination Footer */}
        {total > 0 && (
          <DataTablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50]}
            entityName="transaksi billing"
          />
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
