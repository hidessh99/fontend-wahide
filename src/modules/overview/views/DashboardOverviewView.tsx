"use client";

import React from "react";
import { useDashboardStats } from "@/modules/iam/hooks/useDashboardStats";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import { RefreshCw } from "lucide-react";
import { UserDashboardOverview } from "../components/UserDashboardOverview";
import { AdminDashboardOverview } from "../components/AdminDashboardOverview";

export function DashboardOverviewView() {
  const { isSuperAdmin, userStats, adminStats, isLoading, error, refetch } = useDashboardStats();
  const { t } = useI18n();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8">
        <div className="space-y-3 rounded-md border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
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

  if (isSuperAdmin && adminStats) {
    return <AdminDashboardOverview stats={adminStats} />;
  }

  return <UserDashboardOverview stats={userStats} />;
}

// =========================================================================
// SKELETON LOADER (CLS = 0)
// =========================================================================

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* 4 Cards Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border-border bg-surface space-y-3 rounded-xl border p-4 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="size-8 rounded-full" />
            </div>
            <Skeleton className="h-7 w-32 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        ))}
      </div>

      {/* 2 Columns Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border-border bg-surface space-y-4 rounded-xl border p-4 sm:p-6"
          >
            <Skeleton className="h-5 w-40 rounded" />
            <div className="space-y-2.5">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-14 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
