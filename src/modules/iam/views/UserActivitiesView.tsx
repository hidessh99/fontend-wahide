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
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <Activity className="size-5" />
            </div>
            <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
              Log Aktivitas Akun
            </h1>
            <span className="bg-wise-green/10 text-dark-green dark:text-wise-green border-wise-green/20 hidden items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold sm:inline-flex">
              <ShieldCheck className="size-3" />
              <span>Audit Akun Pribadi</span>
            </span>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-sm font-semibold">
            Pantau seluruh rekaman riwayat autentikasi sesi, transaksi saldo/top-up, perubahan
            profil, dan koneksi WhatsApp pada akun Anda.
          </p>
        </div>

        {/* Live Total Indicator */}
        <div className="bg-muted border-border text-foreground-secondary flex items-center gap-2 self-start rounded-full border px-3.5 py-1.5 text-xs font-bold sm:self-auto">
          <span className="bg-wise-green size-2 animate-pulse rounded-full" />
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
