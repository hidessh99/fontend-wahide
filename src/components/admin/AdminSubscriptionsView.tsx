"use client";

import React from "react";
import { useAdminSubscriptions } from "@/modules/admin/hooks/useAdminSubscriptions";
import { SubscriptionsTable } from "@/modules/admin/components/subscriptions/SubscriptionsTable";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
} from "lucide-react";

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

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Langganan</span>
            <Receipt className="size-4 text-foreground-secondary" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-foreground">
            {metrics.totalCount.toLocaleString("id-ID")} Akun
          </div>
          <span className="text-[10px] text-foreground-muted">Terdaftar di platform</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Langganan Aktif</span>
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-wise-green">
            {metrics.activeCount.toLocaleString("id-ID")} Akun
          </div>
          <span className="text-[10px] text-foreground-muted">Memiliki kuota &amp; akses aktif</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kedaluwarsa (Expired)</span>
            <Clock className="size-4 text-rose-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-rose-600 dark:text-rose-400">
            {metrics.expiredCount.toLocaleString("id-ID")} Akun
          </div>
          <span className="text-[10px] text-foreground-muted">Masa aktif telah berakhir</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
          <div className="flex items-center justify-between text-foreground-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Trial / Suspended</span>
            <Sparkles className="size-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-black font-mono text-amber-600 dark:text-amber-400">
            {(metrics.trialCount + metrics.suspendedCount).toLocaleString("id-ID")} Akun
          </div>
          <span className="text-[10px] text-foreground-muted">
            {metrics.trialCount} Uji Coba &bull; {metrics.suspendedCount} Ditangguhkan
          </span>
        </div>
      </div>

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
