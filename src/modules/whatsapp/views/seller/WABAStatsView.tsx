"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Layers,
  Inbox,
  ShieldCheck,
} from "lucide-react";
import {
  useWABAStats,
  WABAStatsTimeRange,
} from "@/modules/whatsapp/hooks/useWABAStats";

const TIME_RANGES: {
  id: WABAStatsTimeRange;
  label: string;
  badgeLabel: string;
}[] = [
  { id: "today", label: "Hari Ini", badgeLabel: "today" },
  { id: "7d", label: "7 Hari", badgeLabel: "last 7 days" },
  { id: "30d", label: "30 Hari", badgeLabel: "last 30 days" },
];

export function WABAStatsView() {
  const { timeRange, setTimeRange, stats, isLoading, refetch } =
    useWABAStats();

  const activePeriodLabel =
    TIME_RANGES.find((r) => r.id === timeRange)?.badgeLabel || "today";

  // Calculate maximum total volume for normalized bar scaling in Daily Activity
  const maxDayTotal = Math.max(
    ...stats.dailyActivity.map((d) => d.total),
    1,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header with Title & Period Filter Switcher */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Statistik Meta WABA Official
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Pantau transmisi Cloud API resmi Meta, rasio delivery ACK, dan utilisasi nomor WABA.
          </p>
        </div>

        {/* Action Bar: Time Range Selector & Refresh */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="bg-muted/60 border-border/80 flex items-center rounded-full border p-1">
            {TIME_RANGES.map((range) => {
              const isActive = timeRange === range.id;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setTimeRange(range.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-dark-green shadow-xs dark:bg-wise-green dark:text-dark-green"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="border-border/80 text-xs font-semibold rounded-full h-8 px-3"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Muat Ulang</span>
          </Button>
        </div>
      </div>

      {/* Top 3 KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 1. Total Sends */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Total sends
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-muted/60 text-foreground-secondary">
              <Send className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <p className="font-mono text-3xl font-black text-foreground">
                {stats.totalSends.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-foreground-muted text-[11px] lowercase">
            {activePeriodLabel}
          </p>
        </div>

        {/* 2. Delivered */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Delivered
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <p className="font-mono text-3xl font-black text-foreground">
                {stats.deliveredCount.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
            {stats.deliveryRate}% delivery rate
          </p>
        </div>

        {/* 3. Failed */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Failed
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <p
                className={`font-mono text-3xl font-black ${
                  stats.failedCount > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-foreground"
                }`}
              >
                {stats.failedCount.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-rose-600/90 dark:text-rose-400/90 text-[11px] font-semibold">
            {stats.failureRate}% failure rate
          </p>
        </div>
      </div>

      {/* Row 2: Daily Activity Chart & Histogram */}
      <div className="bg-surface border-border rounded-2xl border p-6 space-y-5 shadow-xs dark:bg-[#151614]">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-foreground text-sm font-bold">Daily activity</h3>
            <p className="text-foreground-secondary text-xs">
              Delivered vs failed per day — {activePeriodLabel}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-foreground-secondary">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 dark:bg-wise-green" />
              <span>Delivered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              <span>Failed</span>
            </div>
          </div>
        </div>

        {/* Activity Container / Empty State */}
        {isLoading ? (
          <div className="space-y-3 py-8">
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : !stats.hasActivity ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-14 text-center">
            <div className="mb-2.5 flex size-10 items-center justify-center rounded-full bg-muted/50 text-foreground-muted">
              <BarChart3 className="size-5" />
            </div>
            <p className="text-foreground-secondary text-xs font-medium">
              No message activity in this period.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Visual Bars Container */}
            <div className="flex items-end gap-2 sm:gap-4 overflow-x-auto pb-2 min-h-[160px] pt-4">
              {stats.dailyActivity.map((day) => {
                const deliveredPercent =
                  day.total > 0
                    ? Math.round((day.delivered / maxDayTotal) * 100)
                    : 0;
                const failedPercent =
                  day.total > 0
                    ? Math.round((day.failed / maxDayTotal) * 100)
                    : 0;

                return (
                  <div
                    key={day.dateKey}
                    className="flex flex-1 min-w-[32px] flex-col items-center gap-2 group"
                  >
                    {/* Bar Visualizer */}
                    <div className="relative flex h-32 w-full max-w-[42px] flex-col justify-end overflow-hidden rounded-md bg-muted/30">
                      {/* Delivered Stack */}
                      <div
                        style={{ height: `${deliveredPercent}%` }}
                        className="w-full bg-emerald-500 dark:bg-wise-green transition-all duration-300"
                        title={`${day.label}: ${day.delivered} delivered`}
                      />
                      {/* Failed Stack */}
                      <div
                        style={{ height: `${failedPercent}%` }}
                        className="w-full bg-rose-500 transition-all duration-300"
                        title={`${day.label}: ${day.failed} failed`}
                      />
                    </div>

                    {/* Date Label */}
                    <span className="text-[10px] sm:text-[11px] font-medium text-foreground-muted group-hover:text-foreground transition-colors whitespace-nowrap">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Row 3: 2 Breakdown Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card 1: Top Send Types */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
          <div className="space-y-0.5">
            <h3 className="text-foreground text-sm font-bold">Top send types</h3>
            <p className="text-foreground-secondary text-xs">
              Direct sends vs named campaigns in this period.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : stats.topSendTypes.total === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-10 text-center">
              <Inbox className="size-6 text-foreground-muted mb-2" />
              <p className="text-foreground-secondary text-xs font-medium">
                No sends in this period.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Direct Sends */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Send className="size-3.5 text-muted-foreground" />
                    Direct sends (Pesan Cepat HSM / Utility)
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {stats.topSendTypes.directCount.toLocaleString()}{" "}
                    <span className="text-foreground-muted font-normal">
                      ({stats.topSendTypes.directPercent}%)
                    </span>
                  </span>
                </div>
                <Progress
                  value={stats.topSendTypes.directPercent}
                  className="h-2"
                />
              </div>

              {/* Named Campaigns */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="size-3.5 text-muted-foreground" />
                    Named campaigns (Broadcast Marketing)
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {stats.topSendTypes.campaignCount.toLocaleString()}{" "}
                    <span className="text-foreground-muted font-normal">
                      ({stats.topSendTypes.campaignPercent}%)
                    </span>
                  </span>
                </div>
                <Progress
                  value={stats.topSendTypes.campaignPercent}
                  className="h-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Card 2: By Number */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
          <div className="space-y-0.5">
            <h3 className="text-foreground text-sm font-bold">By number</h3>
            <p className="text-foreground-secondary text-xs">
              Top numbers by outbound volume.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : stats.byNumber.length === 0 || stats.totalSends === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-10 text-center">
              <Smartphone className="size-6 text-foreground-muted mb-2" />
              <p className="text-foreground-secondary text-xs font-medium">
                No sends in this period.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {stats.byNumber.map((acc, idx) => (
                <div
                  key={acc.id}
                  className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground-muted">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground leading-none">
                            {acc.name}
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400">
                            <ShieldCheck className="size-2.5" />
                            {acc.qualityRating}
                          </span>
                        </div>
                        {acc.phone && (
                          <p className="text-[11px] font-mono text-foreground-muted mt-0.5">
                            +{acc.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {acc.count.toLocaleString()} pesan
                      </span>
                      <span className="text-[10px] text-foreground-muted ml-1">
                        ({acc.percent}%)
                      </span>
                    </div>
                  </div>

                  <Progress value={acc.percent} className="h-1.5" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WABAStatsView;
