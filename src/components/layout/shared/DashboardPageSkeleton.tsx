"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardPageSkeletonProps {
  showMetrics?: boolean;
  metricCount?: number;
  rowCount?: number;
}

/**
 * Universal Streaming Skeleton for Dashboard & Admin Views.
 * Renders an instant 0ms silhouette placeholder matching Wahide's design system.
 */
export function DashboardPageSkeleton({
  showMetrics = true,
  metricCount = 4,
  rowCount = 6,
}: DashboardPageSkeletonProps) {
  return (
    <div className="animate-in fade-in mx-auto max-w-7xl space-y-6 p-3 duration-150 sm:space-y-8 sm:p-6 lg:p-8">
      {/* 1. Header Skeleton */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-40 rounded-md sm:h-9 sm:w-56" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-52 rounded-md sm:w-80" />
        </div>

        {/* Top Action Buttons Skeleton */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* 2. Metric Cards Grid Skeleton */}
      {showMetrics && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: metricCount }).map((_, i) => (
            <div
              key={i}
              className="border-border bg-surface space-y-3 rounded-md border p-4 shadow-xs sm:p-5 dark:bg-[#161715]"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="size-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* 3. Filter / Search Toolbar Skeleton */}
      <div className="border-border bg-surface flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-9 max-w-md flex-1 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>

      {/* 4. Table / Content List Skeleton */}
      <div className="border-border bg-surface divide-border/40 divide-y overflow-hidden rounded-md border shadow-xs dark:bg-[#161715]">
        {/* Table Header Bar */}
        <div className="bg-muted/20 flex items-center justify-between gap-4 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="hidden h-4 w-20 rounded-md sm:block" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-3.5 sm:p-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton
                  className="h-4 rounded-md"
                  style={{ width: `${60 + (i % 3) * 15}%`, maxWidth: "240px" }}
                />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            </div>

            <Skeleton className="hidden h-6 w-20 shrink-0 rounded-full sm:block" />
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
