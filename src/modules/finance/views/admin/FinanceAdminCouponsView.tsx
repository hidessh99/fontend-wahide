"use client";

import React, { useState } from "react";
import { useAdminCoupons } from "../../hooks/useAdminCoupons";
import { Voucher } from "../../types/coupon.types";
import { CouponFormModal } from "../../components/admin/CouponFormModal";
import { DeleteCouponModal } from "../../components/admin/DeleteCouponModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Ticket,
  Copy,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent,
  Coins,
  Activity,
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
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";

export function FinanceAdminCouponsView() {
  const { t, locale } = useI18n();
  const {
    coupons,
    isLoading,
    searchQuery,
    page,
    pageSize,
    total,
    totalPages,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleActive,
    executeSearch,
    clearSearch,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    fetchCoupons,
  } = useAdminCoupons();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCouponForEdit, setSelectedCouponForEdit] =
    useState<Voucher | null>(null);
  const [selectedCouponForDelete, setSelectedCouponForDelete] =
    useState<Voucher | null>(null);

  const { sortKey, sortOrder, handleSort, sortData } =
    useTableSort<Voucher>({
      initialKey: "createdAt",
      initialOrder: "desc",
    });

  const sortedData = sortData(coupons);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(
      t("admin.coupons.copiedToast", { text }) || `Kode "${text}" disalin ke clipboard!`,
    );
  };

  const isExpired = (endDateStr: string) => {
    return new Date(endDateStr) < new Date();
  };

  // Metrics summary
  const activeCount = coupons.filter((c) => c.isActive && !isExpired(c.endDate)).length;
  const totalClaims = coupons.reduce((sum, c) => sum + (c.currentUsage || 0), 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 sm:size-9">
              <Ticket className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("admin.coupons.title") || "Manajemen Kupon Promo"}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("admin.coupons.subtitle") ||
              "Kelola kupon diskon persentase dan potongan harga tetap untuk pembelian paket langganan."}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-wise-green text-dark-green hover:bg-wise-green/90 h-9 cursor-pointer gap-1.5 rounded-full px-5 text-xs font-black shadow-xs"
        >
          <Plus className="size-4" />
          <span>{t("admin.coupons.createCouponBtn") || "Tambah Kupon Baru"}</span>
        </Button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-foreground-muted text-xs font-semibold">
            <span>{t("admin.coupons.statTotalCoupons") || "Total Kupon"}</span>
            <Ticket className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground">{total}</p>
          <p className="text-[11px] text-foreground-muted">
            {t("admin.coupons.statTotalCouponsDesc") || "Kupon promo terdaftar"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-foreground-muted text-xs font-semibold">
            <span>{t("admin.coupons.statActiveCoupons") || "Kupon Aktif"}</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </p>
          <p className="text-[11px] text-foreground-muted">
            {t("admin.coupons.statActiveCouponsDesc") || "Siap diklaim oleh tenant"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-foreground-muted text-xs font-semibold">
            <span>{t("admin.coupons.statTotalUsage") || "Total Klaim"}</span>
            <Activity className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{totalClaims}</p>
          <p className="text-[11px] text-foreground-muted">
            {t("admin.coupons.statTotalUsageDesc") || "Kali kupon digunakan"}
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="space-y-4">
        <div className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <SearchInput
              value={searchQuery}
              onSearch={executeSearch}
              onClear={clearSearch}
              placeholder={t("admin.coupons.searchPlaceholder") || "Cari kode kupon atau nama promo..."}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchCoupons}
            disabled={isLoading}
            className="border-border hover:bg-muted h-9 shrink-0 gap-1.5 rounded-full text-xs font-bold cursor-pointer"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("common.refresh") || "Segarkan"}</span>
          </Button>
        </div>

        <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
          <div className="relative w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-border border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-3">
                    <DataTableColumnHeader
                      title={t("admin.coupons.colCode") || "Kode & Nama Promo"}
                      columnKey="code"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <DataTableColumnHeader
                      title={t("admin.coupons.colDiscount") || "Nilai Diskon"}
                      columnKey="discountValue"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="center"
                    />
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <DataTableColumnHeader
                      title={t("admin.coupons.colLimits") || "Syarat & Batas"}
                      columnKey="minPurchaseAmount"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="center"
                    />
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <DataTableColumnHeader
                      title={t("admin.coupons.colUsage") || "Penggunaan"}
                      columnKey="currentUsage"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="center"
                    />
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <DataTableColumnHeader
                      title={t("admin.coupons.colPeriod") || "Masa Berlaku"}
                      columnKey="endDate"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="center"
                    />
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <span className="text-xs font-bold text-foreground">
                      {t("admin.coupons.colStatus") || "Status"}
                    </span>
                  </TableHead>
                  <TableHead className="py-3 text-right">
                    <span className="text-xs font-bold text-foreground">
                      {t("admin.coupons.colActions") || "Aksi"}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && coupons.length === 0 ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7} className="h-16 text-center">
                        <div className="bg-muted/50 mx-auto h-4 w-3/4 animate-pulse rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12">
                      <EmptyState
                        icon={<Ticket className="size-10" />}
                        title={
                          searchQuery
                            ? t("admin.coupons.emptySearchTitle") || "Kupon Tidak Ditemukan"
                            : t("admin.coupons.emptyTitle") || "Belum Ada Kupon Promo"
                        }
                        description={
                          searchQuery
                            ? t("admin.coupons.emptySearchDesc", { query: searchQuery }) ||
                              `Tidak ada kupon yang cocok dengan kata kunci "${searchQuery}".`
                            : t("admin.coupons.emptyDesc") ||
                              "Buat kupon promo pertama untuk memberikan diskon pada langganan tenant."
                        }
                        action={
                          searchQuery ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearSearch}
                              className="rounded-full cursor-pointer"
                            >
                              {t("common.clearSearch") || "Bersihkan Pencarian"}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => setIsCreateModalOpen(true)}
                              className="bg-wise-green text-dark-green hover:bg-wise-green/90 rounded-full px-5 text-xs font-black shadow-xs cursor-pointer"
                            >
                              <Plus className="size-4 mr-1" />
                              <span>{t("admin.coupons.createCouponBtn") || "Tambah Kupon Baru"}</span>
                            </Button>
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((item) => {
                    const expired = isExpired(item.endDate);
                    const usagePercent =
                      item.maxUsage > 0
                        ? Math.min(100, Math.round((item.currentUsage / item.maxUsage) * 100))
                        : 0;

                    return (
                      <TableRow
                        key={item.id}
                        className="border-border hover:bg-muted/30 transition-colors"
                      >
                        {/* Code & Name */}
                        <TableCell className="py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(item.code)}
                                className="inline-flex items-center gap-1 font-mono font-black text-xs px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 cursor-pointer transition"
                                title="Klik untuk salin kode"
                              >
                                <span>{item.code}</span>
                                <Copy className="size-2.5 opacity-60" />
                              </button>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {item.applicableProduct}
                              </Badge>
                            </div>
                            <p className="text-foreground text-xs font-bold leading-tight truncate max-w-xs">
                              {item.name}
                            </p>
                          </div>
                        </TableCell>

                        {/* Discount Type & Value */}
                        <TableCell className="py-3 text-center">
                          <div className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                            {item.discountType === "PERCENTAGE" ? (
                              <>
                                <Percent className="size-3" />
                                <span>{item.discountValue}% OFF</span>
                              </>
                            ) : (
                              <>
                                <Coins className="size-3" />
                                <span>
                                  Rp {item.discountValue.toLocaleString(locale === "id" ? "id-ID" : "en-US")} OFF
                                </span>
                              </>
                            )}
                          </div>
                        </TableCell>

                        {/* Limits (Min Purchase & Max Discount) */}
                        <TableCell className="py-3 text-center">
                          <div className="text-[11px] space-y-0.5">
                            <div className="text-foreground-secondary">
                              Min:{" "}
                              {item.minPurchaseAmount > 0
                                ? `Rp ${item.minPurchaseAmount.toLocaleString(locale === "id" ? "id-ID" : "en-US")}`
                                : t("admin.coupons.noMinimum") || "Tanpa Min."}
                            </div>
                            {item.discountType === "PERCENTAGE" && (
                              <div className="text-foreground-muted text-[10px]">
                                Maks:{" "}
                                {item.maxDiscountAmount > 0
                                  ? `Rp ${item.maxDiscountAmount.toLocaleString(locale === "id" ? "id-ID" : "en-US")}`
                                  : t("admin.coupons.unlimited") || "Tak Terbatas"}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Usage Progress */}
                        <TableCell className="py-3 text-center">
                          <div className="space-y-1 w-28 mx-auto">
                            <div className="flex justify-between text-[10px] font-bold text-foreground">
                              <span>{item.currentUsage}</span>
                              <span className="text-foreground-muted">
                                {item.maxUsage > 0 ? `/ ${item.maxUsage}` : "∞"}
                              </span>
                            </div>
                            {item.maxUsage > 0 && (
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    usagePercent >= 100 ? "bg-rose-500" : "bg-wise-green"
                                  }`}
                                  style={{ width: `${usagePercent}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Period & Expired Pill */}
                        <TableCell className="py-3 text-center">
                          <div className="text-[11px] space-y-0.5">
                            <div className="text-foreground font-semibold flex items-center justify-center gap-1">
                              <Calendar className="size-3 text-muted-foreground" />
                              <span>
                                {new Date(item.endDate).toLocaleDateString(
                                  locale === "id" ? "id-ID" : "en-US",
                                  { day: "numeric", month: "short", year: "numeric" },
                                )}
                              </span>
                            </div>
                            {expired ? (
                              <span className="inline-block text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded-full">
                                {t("admin.coupons.expired") || "Kedaluwarsa"}
                              </span>
                            ) : (
                              <span className="inline-block text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                {t("admin.coupons.valid") || "Berlaku"}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status Toggle Button */}
                        <TableCell className="py-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleActive(item)}
                            className="cursor-pointer transition hover:opacity-80"
                            title={
                              item.isActive
                                ? t("admin.coupons.clickToDeactivate") || "Klik untuk nonaktifkan"
                                : t("admin.coupons.clickToActivate") || "Klik untuk aktifkan"
                            }
                          >
                            {item.isActive ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                                <CheckCircle2 className="size-3" />
                                <span>{t("common.active") || "Aktif"}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-muted bg-muted/40 px-2 py-0.5 text-[11px] font-bold text-foreground-muted">
                                <XCircle className="size-3" />
                                <span>{t("common.inactive") || "Nonaktif"}</span>
                              </span>
                            )}
                          </button>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedCouponForEdit(item)}
                              className="size-8 rounded-full hover:bg-muted text-foreground-secondary hover:text-foreground cursor-pointer"
                              title={t("common.edit") || "Edit"}
                            >
                              <Edit2 className="size-3.5" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedCouponForDelete(item)}
                              className="size-8 rounded-full hover:bg-rose-500/10 text-destructive cursor-pointer"
                              title={t("common.delete") || "Hapus"}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="border-border border-t p-4">
            <DataTablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onNextPage={nextPage}
              onPrevPage={prevPage}
              entityName={t("admin.coupons.statTotalCoupons") || "kupon"}
            />
          </div>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      <CouponFormModal
        coupon={selectedCouponForEdit}
        isOpen={isCreateModalOpen || Boolean(selectedCouponForEdit)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedCouponForEdit(null);
        }}
        onSubmit={async (data) => {
          if (selectedCouponForEdit) {
            return await updateCoupon(selectedCouponForEdit.id, data);
          }
          return await createCoupon(data);
        }}
      />

      {/* Delete Coupon Confirmation Modal */}
      <DeleteCouponModal
        couponCode={selectedCouponForDelete?.code || ""}
        couponName={selectedCouponForDelete?.name}
        isOpen={Boolean(selectedCouponForDelete)}
        onClose={() => setSelectedCouponForDelete(null)}
        onConfirm={async () => {
          if (selectedCouponForDelete) {
            await deleteCoupon(selectedCouponForDelete.id);
          }
        }}
      />
    </div>
  );
}
