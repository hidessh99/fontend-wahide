"use client";

import React from "react";
import { useDashboardStats } from "@/modules/iam/hooks/useDashboardStats";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import { RefreshCw } from "lucide-react";
import { UserDashboardOverview as OverviewSellerDashboard } from "../../components/seller/OverviewSellerDashboard";

export function OverviewSellerDashboardView() {
  const { userStats, isLoading, error, refetch } = useDashboardStats();
  const { t } = useI18n();

  if (isLoading && !userStats) {
    return <DashboardSkeleton />;
  }

  if (error && !userStats) {
    return (
      <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8">
        <div className="space-y-3 rounded-md border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-sm font-bold text-red-600 dark:text-red-400">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 rounded-full text-xs font-bold"
          >
            <RefreshCw className="size-3.5" />
            <span>{t("overview.retry")}</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <OverviewSellerDashboard
      stats={userStats}
      onReload={refetch}
      isReloading={isLoading}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-7 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-8 w-60 rounded-md" />
          <Skeleton className="h-4 w-80 sm:w-96 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border-border bg-surface space-y-3 rounded-2xl border p-4 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="size-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        ))}
      </div>

      {/* Asymmetrical 2 Columns Skeleton: 65% / 35% */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          <div className="border-border bg-surface space-y-4 rounded-2xl border p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-3 w-56 rounded" />
              </div>
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>

          <div className="border-border bg-surface space-y-4 rounded-2xl border p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="border-border bg-surface space-y-4 rounded-2xl border p-5 sm:p-6">
            <div className="space-y-1">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-12 w-full rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Skeleton className="h-8 rounded-full" />
              <Skeleton className="h-8 rounded-full" />
            </div>
          </div>

          <div className="border-border bg-surface space-y-3 rounded-2xl border p-5 sm:p-6">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <div className="border-border bg-surface space-y-3 rounded-2xl border p-5 sm:p-6">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewSellerDashboardView;
