"use client";

import React, { useState } from "react";
import { useFinanceAdminBilling } from "@/modules/finance/hooks/useFinanceAdminBilling";
import { useI18n } from "@/lib/i18n/context";
import dynamic from "next/dynamic";
import { AdminBillingItem } from "@/modules/finance/types/admin.types";

const UpdateBillingStatusModal = dynamic(
  () =>
    import("@/modules/finance/components/admin/UpdateBillingStatusModal").then(
      (m) => m.UpdateBillingStatusModal,
    ),
  { ssr: false },
);
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { NativeSelect } from "@/components/ui/native-select";
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

function getStatusBadge(
  status: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "PAID":
      return (
        <Badge variant="success">
          <CheckCircle2 className="size-3" />
          <span>{t("admin.billing.statusPaid")}</span>
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="warning">
          <Clock className="size-3" />
          <span>{t("admin.billing.statusPending")}</span>
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge variant="secondary">
          <RefreshCw className="size-3 animate-spin" />
          <span>{t("admin.billing.statusProcessing")}</span>
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Clock className="size-3" />
          <span>{t("admin.billing.statusExpired")}</span>
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="destructive">
          <Ban className="size-3" />
          <span>{t("admin.billing.statusCancelled")}</span>
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function FinanceAdminBillingView() {
  const { t, locale } = useI18n();
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
  } = useFinanceAdminBilling();

  const [selectedBillingForUpdate, setSelectedBillingForUpdate] =
    useState<AdminBillingItem | null>(null);

  const { sortKey, sortOrder, handleSort, sortData } =
    useTableSort<AdminBillingItem>({
      initialKey: "createdAt",
      initialOrder: "desc",
    });

  const sortedData = sortData(billings);

  const formatLocalizedDate = (dateInput?: string): string => {
    if (!dateInput) return "-";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 sm:size-9">
              <Receipt className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("admin.billing.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("admin.billing.subtitle")}
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t("admin.billing.totalTransactions")}
            </span>
            <CreditCard className="text-foreground-secondary size-4" />
          </div>
          <div className="text-foreground font-mono text-lg font-black sm:text-xl">
            {metrics.totalCount.toLocaleString(
              locale === "en" ? "en-US" : "id-ID",
            )}{" "}
            {t("admin.billing.trxUnit")}
          </div>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t("admin.billing.revenueTotal")}
            </span>
            <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-600" />
          </div>
          <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
            Rp{" "}
            {metrics.paidTotal.toLocaleString(
              locale === "en" ? "en-US" : "id-ID",
            )}
          </div>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t("admin.billing.pendingReview")}
            </span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="font-mono text-lg font-black text-amber-600 sm:text-xl dark:text-amber-400">
            {metrics.pendingCount} {t("admin.billing.trxUnit")}
          </div>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t("admin.billing.cancelledExpired")}
            </span>
            <AlertCircle className="text-foreground-muted size-4" />
          </div>
          <div className="text-foreground-secondary font-mono text-lg font-black sm:text-xl">
            {metrics.closedCount} {t("admin.billing.trxUnit")}
          </div>
        </div>
      </div>

      {/* Table & Controls */}
      <div className="space-y-4">
        <div className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="w-full sm:w-72">
              <SearchInput
                value={searchQuery}
                onSearch={executeSearch}
                onClear={clearSearch}
                placeholder={t("admin.billing.searchPlaceholder")}
              />
            </div>

            <div className="w-full sm:w-48">
              <NativeSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-full text-xs font-bold"
              >
                <option value="ALL">
                  {t("admin.billing.filterAllStatus")}
                </option>
                <option value="PAID">{t("admin.billing.filterPaid")}</option>
                <option value="PENDING">
                  {t("admin.billing.filterPending")}
                </option>
                <option value="PROCESSING">
                  {t("admin.billing.filterProcessing")}
                </option>
                <option value="EXPIRED">
                  {t("admin.billing.filterExpired")}
                </option>
                <option value="CANCELLED">
                  {t("admin.billing.filterCancelled")}
                </option>
              </NativeSelect>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchBillings}
            disabled={isLoading}
            className="border-border hover:bg-muted h-9 shrink-0 gap-1.5 rounded-full text-xs font-bold"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("common.refresh")}</span>
          </Button>
        </div>

        {/* Table */}
        <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
          <div className="relative w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-border border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-3">
                    <DataTableColumnHeader
                      title={t("admin.billing.colUser")}
                      columnKey="userId"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="py-3">
                    <DataTableColumnHeader
                      title={t("admin.billing.colAmount")}
                      columnKey="amount"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-foreground-secondary py-3 text-xs font-black tracking-wider uppercase">
                    {t("admin.billing.colMethod")}
                  </TableHead>
                  <TableHead className="py-3">
                    <DataTableColumnHeader
                      title={t("admin.billing.colStatus")}
                      columnKey="status"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="py-3 text-right">
                    <DataTableColumnHeader
                      title={t("admin.billing.colDate")}
                      columnKey="createdAt"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="text-foreground-secondary py-3 text-right text-xs font-black tracking-wider uppercase">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-border divide-y">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="dark:text-wise-green size-6 animate-spin text-emerald-600" />
                        <span className="text-foreground-secondary text-xs font-semibold">
                          {t("admin.billing.loadingTrx")}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-8">
                      <EmptyState
                        icon={<Receipt className="size-10" />}
                        title={t("admin.billing.emptyTitle")}
                        description={t("admin.billing.emptyDesc")}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((billing: AdminBillingItem) => (
                    <TableRow
                      key={billing.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-3">
                        <div className="space-y-0.5">
                          <span className="text-foreground block text-xs font-bold">
                            {billing.user?.name ||
                              `User ${billing.userId.slice(-6)}`}
                          </span>
                          <span className="text-foreground-muted block font-mono text-[11px]">
                            {billing.user?.email || billing.userId}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 font-mono text-xs font-bold">
                        Rp{" "}
                        {billing.amount.toLocaleString(
                          locale === "en" ? "en-US" : "id-ID",
                        )}
                      </TableCell>

                      <TableCell className="py-3 font-mono text-xs uppercase">
                        {billing.method}
                      </TableCell>

                      <TableCell className="py-3">
                        {getStatusBadge(billing.status, t)}
                      </TableCell>

                      <TableCell className="text-foreground-secondary py-3 text-right font-mono text-[11px]">
                        {formatLocalizedDate(billing.createdAt)}
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {billing.invoiceUrl && (
                            <a
                              href={billing.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:bg-muted text-foreground-secondary hover:text-foreground flex size-8 items-center justify-center rounded-full"
                              title={t("admin.billing.viewInvoiceTooltip")}
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}

                          {(billing.status === "PENDING" ||
                            billing.status === "PROCESSING") && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSelectedBillingForUpdate(billing)
                              }
                              className="text-amber-600 hover:bg-amber-500/10 size-8 rounded-full dark:text-amber-400"
                              title={t("admin.billing.updateStatusTooltip")}
                            >
                              <RotateCcw className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {billings.length > 0 && (
            <div className="border-border border-t p-3 sm:p-4">
              <DataTablePagination
                page={page}
                pageSize={pageSize}
                total={total}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                onNextPage={nextPage}
                onPrevPage={prevPage}
              />
            </div>
          )}
        </div>
      </div>

      <UpdateBillingStatusModal
        billing={selectedBillingForUpdate}
        isOpen={Boolean(selectedBillingForUpdate)}
        onClose={() => setSelectedBillingForUpdate(null)}
        onSubmit={updateStatus}
      />
    </div>
  );
}

export default FinanceAdminBillingView;
