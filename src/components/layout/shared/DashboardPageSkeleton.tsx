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
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 animate-in fade-in duration-150">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 sm:h-9 w-40 sm:w-56 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-52 sm:w-80 rounded-md" />
        </div>

        {/* Top Action Buttons Skeleton */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* 2. Metric Cards Grid Skeleton */}
      {showMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: metricCount }).map((_, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-3 shadow-xs"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        <div className="flex-1 flex items-center gap-2">
          <Skeleton className="h-9 flex-1 max-w-md rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>

      {/* 4. Table / Content List Skeleton */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs divide-y divide-border/40">
        {/* Table Header Bar */}
        <div className="p-3 sm:p-4 bg-muted/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-4 w-20 rounded-md hidden sm:block" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: rowCount }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 sm:p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Skeleton className="size-4 rounded shrink-0" />
              <Skeleton className="size-9 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton
                  className="h-4 rounded-md"
                  style={{ width: `${60 + (i % 3) * 15}%`, maxWidth: "240px" }}
                />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            </div>

            <Skeleton className="h-6 w-20 rounded-full shrink-0 hidden sm:block" />
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
