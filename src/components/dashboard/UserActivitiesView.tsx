"use client";

import React from "react";
import { useUserActivities } from "@/modules/iam/hooks/useUserActivities";
import { UserActivityForm } from "@/modules/iam/components/activity/UserActivityForm";
import { Activity, ShieldCheck } from "lucide-react";

export function UserActivitiesView() {
  const {
    filteredActivities,
    isLoading,
    activeSearch,
    typeFilter,
    page,
    pageSize,
    total,
    totalPages,
    executeSearch,
    clearSearch,
    setTypeFilter,
    nextPage,
    prevPage,
    refresh,
  } = useUserActivities();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
              <Activity className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Log Aktivitas Akun
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-wise-green/10 text-dark-green dark:text-wise-green border border-wise-green/20 font-mono">
              <ShieldCheck className="size-3" />
              <span>Audit Akun Pribadi</span>
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            Pantau seluruh rekaman riwayat autentikasi sesi, transaksi saldo/top-up, perubahan profil, dan koneksi WhatsApp pada akun Anda.
          </p>
        </div>

        {/* Live Total Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-bold text-foreground-secondary self-start sm:self-auto">
          <span className="size-2 rounded-full bg-wise-green animate-pulse" />
          <span>{total} Total Rekaman</span>
        </div>
      </div>

      {/* Activities Form / Table */}
      <UserActivityForm
        activities={filteredActivities}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        activeSearch={activeSearch}
        typeFilter={typeFilter}
        onSearch={executeSearch}
        onClearSearch={clearSearch}
        onTypeFilterChange={setTypeFilter}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onRefresh={refresh}
      />
    </div>
  );
}
