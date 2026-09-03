"use client";

import React from "react";
import { useUserActivities } from "@/modules/admin/hooks/useUserActivities";
import { UserActivitiesTable } from "@/modules/admin/components/activity/UserActivitiesTable";
import { Activity, ShieldCheck } from "lucide-react";

export function AdminActivitiesView() {
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
    deleteActivity,
    refresh,
  } = useUserActivities();

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 space-y-6 overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Activity className="size-5" />
            </div>
            <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
              Log Aktivitas Pengguna
            </h1>
            <span className="hidden items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-600 sm:inline-flex dark:text-rose-400">
              <ShieldCheck className="size-3" />
              <span>Audit Real-Time</span>
            </span>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-sm font-semibold">
            Pantau seluruh rekaman jejak audit, autentikasi sesi, dan perubahan data akun pengguna
            di seluruh platform.
          </p>
        </div>

        {/* Live Total Indicator */}
        <div className="bg-muted border-border text-foreground-secondary flex items-center gap-2 self-start rounded-full border px-3.5 py-1.5 text-xs font-bold sm:self-auto">
          <span className="size-2 animate-pulse rounded-full bg-rose-500" />
          <span>{total} Total Rekaman</span>
        </div>
      </div>

      {/* Activities Table */}
      <UserActivitiesTable
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
        onDeleteActivity={deleteActivity}
      />
    </div>
  );
}
