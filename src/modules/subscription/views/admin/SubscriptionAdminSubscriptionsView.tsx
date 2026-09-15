"use client";

import React, { useState } from "react";
import { useSubscriptionAdminSubscriptions } from "@/modules/subscription/hooks/useSubscriptionAdminSubscriptions";
import dynamic from "next/dynamic";
import { AdminSubscriptionItem } from "@/modules/subscription/types/admin.types";

const ExpireSubscriptionModal = dynamic(
  () =>
    import("@/modules/subscription/components/admin/ExpireSubscriptionModal").then(
      (m) => m.ExpireSubscriptionModal,
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
  Loader2,
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

function getStatusBadge(
  status: string,
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ACTIVE":
      return (
        <Badge variant="success">
          <CheckCircle2 className="size-3" />
          <span>{t("admin.subscriptions.statusActive")}</span>
        </Badge>
      );
    case "TRIAL":
      return (
        <Badge variant="warning">
          <Clock className="size-3" />
          <span>{t("admin.subscriptions.statusTrial")}</span>
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Clock className="size-3" />
          <span>{t("admin.subscriptions.statusExpired")}</span>
        </Badge>
      );
    case "SUSPENDED":
      return (
        <Badge variant="destructive">
          <Ban className="size-3" />
          <span>{t("admin.subscriptions.statusSuspended")}</span>
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function SubscriptionAdminSubscriptionsView() {
  const { t, locale } = useI18n();
  const {
    subscriptions,
    isLoading,
    searchQuery,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    metrics,
    fetchSubscriptions,
    expireSubscription,
    executeSearch,
    clearSearch,
    setStatusFilter,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
  } = useSubscriptionAdminSubscriptions();

  const [selectedSubForExpire, setSelectedSubForExpire] =
    useState<AdminSubscriptionItem | null>(null);

  const { sortKey, sortOrder, handleSort, sortData } =
    useTableSort<AdminSubscriptionItem>({
      initialKey: "startedAt",
      initialOrder: "desc",
    });

  const sortedData = sortData(subscriptions);

  const formatLocalizedDate = (dateInput?: string): string => {
    if (!dateInput) return "-";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
              {t("admin.subscriptions.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("admin.subscriptions.subtitle")}
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t("admin.subscriptions.totalSubs")}
            </span>
            <Receipt className="text-foreground-secondary size-4" />
          </div>
          <div className="text-foreground font-mono text-lg font-black sm:text-xl">
            {metrics.totalCount} {t("admin.subscriptions.subUnit")}
          </div>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t("admin.subscriptions.activeSubs")}
            </span>
            <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-600" />
          </div>
          <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
            {metrics.activeCount} {t("admin.subscriptions.subUnit")}
          </div>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t("admin.subscriptions.trialSubs")}
            </span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="font-mono text-lg font-black text-amber-600 sm:text-xl dark:text-amber-400">
            {metrics.trialCount} {t("admin.subscriptions.subUnit")}
          </div>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4 shadow-xs">
          <div className="text-foreground-muted mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {t("admin.subscriptions.expiredSubs")}
            </span>
            <AlertCircle className="text-foreground-muted size-4" />
          </div>
          <div className="text-foreground-secondary font-mono text-lg font-black sm:text-xl">
            {metrics.expiredCount} {t("admin.subscriptions.subUnit")}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="space-y-4">
        <div className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="w-full sm:w-72">
              <SearchInput
                value={searchQuery}
                onSearch={executeSearch}
                onClear={clearSearch}
                placeholder={t("admin.subscriptions.searchPlaceholder")}
              />
            </div>

            <div className="w-full sm:w-48">
              <NativeSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-full text-xs font-bold"
              >
                <option value="ALL">
                  {t("admin.subscriptions.filterAllStatus")}
                </option>
                <option value="ACTIVE">
                  {t("admin.subscriptions.filterActive")}
                </option>
                <option value="TRIAL">
                  {t("admin.subscriptions.filterTrial")}
                </option>
                <option value="EXPIRED">
                  {t("admin.subscriptions.filterExpired")}
                </option>
                <option value="SUSPENDED">
                  {t("admin.subscriptions.filterSuspended")}
                </option>
              </NativeSelect>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchSubscriptions}
            disabled={isLoading}
            className="border-border hover:bg-muted h-9 shrink-0 gap-1.5 rounded-full text-xs font-bold"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("common.refresh")}</span>
          </Button>
        </div>

        <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
          <div className="relative w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-border border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-3">
                    <DataTableColumnHeader
                      title={t("admin.subscriptions.colTenant")}
                      columnKey="tenantId"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="text-foreground-secondary py-3 text-xs font-black tracking-wider uppercase">
                    {t("admin.subscriptions.colPlan")}
                  </TableHead>
                  <TableHead className="py-3">
                    <DataTableColumnHeader
                      title={t("admin.subscriptions.colStatus")}
                      columnKey="status"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="py-3">
                    <DataTableColumnHeader
                      title={t("admin.subscriptions.colStartDate")}
                      columnKey="startedAt"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="py-3 text-right">
                    <DataTableColumnHeader
                      title={t("admin.subscriptions.colExpireDate")}
                      columnKey="expiredAt"
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
                          {t("admin.subscriptions.loadingSubs")}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-8">
                      <EmptyState
                        icon={<Receipt className="size-10" />}
                        title={t("admin.subscriptions.emptyTitle")}
                        description={t("admin.subscriptions.emptyDesc")}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((sub: AdminSubscriptionItem) => (
                    <TableRow
                      key={sub.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-3">
                        <span className="text-foreground block text-xs font-bold">
                          {sub.tenant?.name ||
                            `Tenant ${sub.tenantId.slice(-6)}`}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 text-xs font-semibold">
                        {sub.plan?.name || sub.planId}
                      </TableCell>

                      <TableCell className="py-3">
                        {getStatusBadge(sub.status, t)}
                      </TableCell>

                      <TableCell className="text-foreground-secondary py-3 font-mono text-xs">
                        {formatLocalizedDate(sub.startedAt)}
                      </TableCell>

                      <TableCell className="text-foreground-secondary py-3 text-right font-mono text-xs">
                        {formatLocalizedDate(sub.expiredAt)}
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        {sub.status === "ACTIVE" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSubForExpire(sub)}
                            className="text-rose-600 hover:bg-rose-500/10 rounded-full text-xs font-bold"
                          >
                            <Ban className="mr-1 size-3.5" />
                            <span>{t("admin.subscriptions.expireAction")}</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {subscriptions.length > 0 && (
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

      {selectedSubForExpire && (
        <ExpireSubscriptionModal
          isOpen={Boolean(selectedSubForExpire)}
          subscription={selectedSubForExpire}
          onClose={() => setSelectedSubForExpire(null)}
          onConfirm={async () => {
            await expireSubscription(selectedSubForExpire.id);
          }}
        />
      )}
    </div>
  );
}

export default SubscriptionAdminSubscriptionsView;
