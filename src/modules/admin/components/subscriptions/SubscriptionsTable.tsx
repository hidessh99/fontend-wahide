"use client";

import React, { useState } from "react";
import { AdminSubscriptionItem } from "@/modules/admin/types/admin.types";
import { ExpireSubscriptionModal } from "./ExpireSubscriptionModal";
import { SubscriptionDetailModal } from "./SubscriptionDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { NativeSelect } from "@/components/ui/native-select";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
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

function getSubscriptionStatusBadge(
  status: string,
  t: (key: string, params?: Record<string, string | number>) => string
) {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "ACTIVE":
      return (
        <Badge variant="success">
          <CheckCircle2 className="size-3" />
          <span>{t("admin.subscriptions.statusBadgeActive")}</span>
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge variant="danger">
          <Clock className="size-3" />
          <span>{t("admin.subscriptions.statusBadgeExpired")}</span>
        </Badge>
      );
    case "TRIAL":
      return (
        <Badge variant="warning">
          <Sparkles className="size-3" />
          <span>{t("admin.subscriptions.statusBadgeTrial")}</span>
        </Badge>
      );
    case "SUSPENDED":
      return (
        <Badge variant="neutral">
          <Ban className="size-3" />
          <span>{t("admin.subscriptions.statusBadgeSuspended")}</span>
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
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState("");
  const [selectedSubForExpire, setSelectedSubForExpire] = useState<AdminSubscriptionItem | null>(
    null
  );
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<AdminSubscriptionItem | null>(
    null
  );
  const [isExpireModalOpen, setIsExpireModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<AdminSubscriptionItem>({
    initialKey: "createdAt",
    initialOrder: "desc",
  });

  const sortedSubscriptions = sortData(subscriptions);

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

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="border-border bg-surface rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => onSearch(searchInput.trim())}
            onClear={handleResetSearch}
            placeholder={t("admin.subscriptions.searchPlaceholder")}
          />

          {/* Filter Status & Refresh */}
          <div className="flex shrink-0 items-center gap-2">
            <NativeSelect
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              variant="pill"
            >
              <option value="ALL">{t("admin.subscriptions.filterAllStatus")}</option>
              <option value="ACTIVE">{t("admin.subscriptions.filterActive")}</option>
              <option value="EXPIRED">{t("admin.subscriptions.filterExpired")}</option>
              <option value="TRIAL">{t("admin.subscriptions.filterTrial")}</option>
              <option value="SUSPENDED">{t("admin.subscriptions.filterSuspended")}</option>
            </NativeSelect>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
              aria-label={t("admin.subscriptions.refreshAria")}
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{t("refresh")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Subscriptions Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">{t("admin.subscriptions.loadingText")}</span>
          </div>
        ) : subscriptions.length === 0 ? (
          <EmptyState
            icon={<CreditCard />}
            title={t("admin.subscriptions.emptyTitle")}
            description={
              searchQuery
                ? t("admin.subscriptions.emptySearchDesc", { query: searchQuery })
                : t("admin.subscriptions.emptyDesc")
            }
          />
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {sortedSubscriptions.map((s) => {
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

                      <div className="shrink-0">{getSubscriptionStatusBadge(s.status, t)}</div>
                    </div>

                    {/* Quota Progress */}
                    <div className="bg-muted/20 border-border/60 space-y-1 rounded-lg border p-2.5 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-foreground-muted font-semibold">
                          {t("admin.subscriptions.quotaUsage")}
                        </span>
                        <span className="text-foreground font-mono font-bold">
                          {s.currentMonthUsage} / {quotaLimit} ({usagePercent}%)
                        </span>
                      </div>
                      <Progress value={usagePercent} className="h-1.5 w-full" />
                    </div>

                    <div className="text-foreground-muted flex items-center justify-between pt-1 text-[11px]">
                      <span>{t("admin.subscriptions.expiresAt", { date: formatDateTime(s.expiredAt) })}</span>
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
                        <span>{t("admin.subscriptions.detailBtn")}</span>
                      </Button>

                      {!isExpired && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenExpire(s)}
                          className="h-8 cursor-pointer gap-1 rounded-full border-amber-500/30 px-2.5 text-xs font-bold text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                          title={t("admin.subscriptions.setExpiredTooltip")}
                        >
                          <Clock className="size-3.5" />
                          <span>{t("admin.subscriptions.setExpiredBtn")}</span>
                        </Button>
                      )}
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
                    <TableHead className="w-[25%] px-5 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.subscriptions.colTenantId")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[18%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.subscriptions.colPlan")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[18%] px-4 py-3.5">
                      <DataTableColumnHeader
                        title={t("admin.subscriptions.colQuotaUsage")}
                        columnKey="currentMonthUsage"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[15%] px-4 py-3.5">
                      <DataTableColumnHeader
                        title={t("admin.subscriptions.colValidity")}
                        columnKey="expiredAt"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title={t("admin.subscriptions.colStatus")}
                        columnKey="status"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-3 py-3.5">
                      <DataTableColumnHeader
                        title={t("admin.subscriptions.colCreatedAt")}
                        columnKey="createdAt"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[10%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.subscriptions.colActions")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSubscriptions.map((s) => {
                    const planName = s.plan?.name || `Plan ${s.planId.slice(0, 8)}`;
                    const tenantName = s.tenant?.name || s.tenantId;
                    const quotaLimit = s.plan?.monthly_message_limit ?? 1000;
                    const usagePercent = Math.min(
                      100,
                      Math.round((s.currentMonthUsage / (quotaLimit || 1)) * 100)
                    );
                    const isExpired = s.status === "EXPIRED";

                    return (
                      <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                        {/* 1. Tenant & ID */}
                        <TableCell className="px-5 py-3.5 align-middle">
                          <div className="space-y-0.5">
                            <div className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                              <Building2 className="text-foreground-muted size-3 shrink-0" />
                              <span className="max-w-40 truncate">{tenantName}</span>
                            </div>
                            <span className="text-foreground-muted block pl-4.5 font-mono text-[10px]">
                              {s.id.slice(0, 16)}...
                            </span>
                          </div>
                        </TableCell>

                        {/* 2. Paket */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="space-y-0.5">
                            <span className="text-foreground block font-bold">{planName}</span>
                            <span className="dark:text-wise-green block font-mono text-[11px] text-emerald-700">
                              {formatCurrency(s.plan?.price ?? 0)}
                            </span>
                          </div>
                        </TableCell>

                        {/* 3. Penggunaan Kuota */}
                        <TableCell className="max-w-xs px-4 py-3.5 align-middle">
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
                        </TableCell>

                        {/* 4. Masa Berlaku */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <span className="text-foreground-muted block text-[10px]">
                              {t("admin.subscriptions.validityStart", { date: formatDateTime(s.startedAt) })}
                            </span>
                            <span className="text-foreground block font-bold">
                              {t("admin.subscriptions.validityUntil", { date: formatDateTime(s.expiredAt) })}
                            </span>
                          </div>
                        </TableCell>

                        {/* 5. Status */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            {getSubscriptionStatusBadge(s.status, t)}
                          </div>
                        </TableCell>

                        {/* 6. Dibuat Pada */}
                        <TableCell className="px-3 py-3.5 align-middle">
                          <span className="text-foreground-secondary block font-mono text-[11px]">
                            {formatDateTime(s.createdAt)}
                          </span>
                        </TableCell>

                        {/* 7. Aksi */}
                        <TableCell className="px-5 py-3.5 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDetail(s)}
                              className="border-border hover:bg-muted h-8 cursor-pointer gap-1 rounded-full px-2.5 text-xs font-bold"
                              title={t("admin.subscriptions.detailTooltip")}
                            >
                              <Eye className="text-foreground-secondary size-3.5" />
                              <span>{t("admin.subscriptions.detailBtn")}</span>
                            </Button>

                            {!isExpired && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenExpire(s)}
                                className="h-8 cursor-pointer gap-1 rounded-full border-amber-500/30 px-2.5 text-xs font-bold text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                                title={t("admin.subscriptions.setExpiredTooltip")}
                              >
                                <Clock className="size-3.5" />
                                <span>{t("admin.subscriptions.setExpiredBtn")}</span>
                              </Button>
                            )}
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
            onPageChange={onPageChange}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={[10, 15, 25, 50, 100]}
            entityName={t("admin.subscriptions.entityName")}
          />
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
