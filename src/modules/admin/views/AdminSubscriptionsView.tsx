"use client";

import React from "react";
import { useAdminSubscriptions } from "@/modules/admin/hooks/useAdminSubscriptions";
import { SubscriptionsTable } from "@/modules/admin/components/subscriptions/SubscriptionsTable";
import { SubscriptionMetricsCards } from "@/modules/admin/components/subscriptions/SubscriptionMetricsCards";
import { CreditCard, Receipt } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function AdminSubscriptionsView() {
  const { t } = useI18n();
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
  } = useAdminSubscriptions();

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

      {/* Summary Metrics Strip (Modular Component) */}
      <SubscriptionMetricsCards metrics={metrics} />

      {/* Main Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="dark:text-wise-green size-4 text-emerald-600" />
            <h2 className="text-foreground text-base font-black">
              {t("admin.subscriptions.listTitle")}
            </h2>
          </div>
        </div>

        <SubscriptionsTable
          subscriptions={subscriptions}
          isLoading={isLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onRefresh={fetchSubscriptions}
          onExpire={expireSubscription}
          onSearch={executeSearch}
          onClearSearch={clearSearch}
          onStatusFilterChange={setStatusFilter}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
      </div>
    </div>
  );
}
