"use client";

import React from "react";
import { useAdminSubscriptions } from "@/modules/admin/hooks/useAdminSubscriptions";
import { SubscriptionsTable } from "@/modules/admin/components/subscriptions/SubscriptionsTable";
import { SubscriptionMetricsCards } from "@/modules/admin/components/subscriptions/SubscriptionMetricsCards";
import { CreditCard, Receipt } from "lucide-react";

export function AdminSubscriptionsView() {
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
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
              <Receipt className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Manajemen Langganan Seluruh Pengguna
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            Pantau seluruh paket langganan aktif, alokasi kuota pesan bulanan, siklus masa berlaku, dan kelola status kedaluwarsa pengguna secara langsung.
          </p>
        </div>
      </div>

      {/* Summary Metrics Strip (Modular Component) */}
      <SubscriptionMetricsCards metrics={metrics} />

      {/* Main Table Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-emerald-600 dark:text-wise-green" />
            <h2 className="text-base font-black text-foreground">
              Daftar Paket Langganan Tenant &amp; User
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
