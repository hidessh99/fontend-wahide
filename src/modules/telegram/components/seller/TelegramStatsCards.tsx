"use client";

import React from "react";
import {
  Bot,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Inbox,
  BarChart3,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ExtendedTelegramStatsData,
  TelegramStatsTimeRange,
} from "../../hooks/useTelegramStats";

interface TelegramStatsCardsProps {
  stats: ExtendedTelegramStatsData;
  isLoading?: boolean;
  timeRange: TelegramStatsTimeRange;
}

export function TelegramStatsCards({
  stats,
  isLoading = false,
  timeRange,
}: TelegramStatsCardsProps) {
  const periodLabel =
    timeRange === "today"
      ? "today"
      : timeRange === "7d"
        ? "last 7 days"
        : "last 30 days";

  const usagePercent = Math.min(
    100,
    Math.round(
      (stats.daily_sent_count / (stats.daily_limit || 100000)) * 100,
    ),
  );

  const maxDayTotal = Math.max(
    ...stats.dailyActivity.map((d) => d.total),
    1,
  );

  return (
    <div className="space-y-6">
      {/* 3 Top KPI Cards Grid */}
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
            {periodLabel}
          </p>
        </div>

        {/* 2. Success */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Success (Terkirim)
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
                {stats.successCount.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
            {stats.successRate}% success rate
          </p>
        </div>

        {/* 3. Failed */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Failed (Gagal)
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
              Success vs failed per day — {periodLabel}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-foreground-secondary">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-sky-500 dark:bg-wise-green" />
              <span>Success</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              <span>Failed</span>
            </div>
          </div>
        </div>

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
            <div className="flex items-end gap-2 sm:gap-4 overflow-x-auto pb-2 min-h-[160px] pt-4">
              {stats.dailyActivity.map((day) => {
                const successPercent =
                  day.total > 0
                    ? Math.round((day.success / maxDayTotal) * 100)
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
                    <div className="relative flex h-32 w-full max-w-[42px] flex-col justify-end overflow-hidden rounded-md bg-muted/30">
                      <div
                        style={{ height: `${successPercent}%` }}
                        className="w-full bg-sky-500 dark:bg-wise-green transition-all duration-300"
                        title={`${day.label}: ${day.success} success`}
                      />
                      <div
                        style={{ height: `${failedPercent}%` }}
                        className="w-full bg-rose-500 transition-all duration-300"
                        title={`${day.label}: ${day.failed} failed`}
                      />
                    </div>
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
              Direct alerts vs broadcast blasts in this period.
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
              {/* Direct Alerts */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Send className="size-3.5 text-muted-foreground" />
                    Direct alerts (Notifikasi 1-on-1)
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

              {/* Broadcast Blasts */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Layers className="size-3.5 text-muted-foreground" />
                    Broadcast blasts (Siaran Massal)
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

        {/* Card 2: By Bot */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
          <div className="space-y-0.5">
            <h3 className="text-foreground text-sm font-bold">By bot</h3>
            <p className="text-foreground-secondary text-xs">
              Top bots by outbound volume.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : stats.byBot.length === 0 || stats.totalSends === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-10 text-center">
              <Bot className="size-6 text-foreground-muted mb-2" />
              <p className="text-foreground-secondary text-xs font-medium">
                No sends in this period.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {stats.byBot.map((bot, idx) => (
                <div
                  key={bot.id}
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
                            {bot.firstName}
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-sky-700 dark:text-sky-400">
                            {bot.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-foreground-muted mt-0.5">
                          @{bot.username}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {bot.count.toLocaleString()} pesan
                      </span>
                      <span className="text-[10px] text-foreground-muted ml-1">
                        ({bot.percent}%)
                      </span>
                    </div>
                  </div>

                  <Progress value={bot.percent} className="h-1.5" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Telegram Operational Health & Quota Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total & Active Bots */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Bot Terhubung
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <Bot className="size-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <div>
              <p className="font-mono text-2xl font-black text-foreground">
                {stats.active_bots}{" "}
                <span className="text-xs text-foreground-muted font-normal">
                  / {stats.total_bots} aktif
                </span>
              </p>
            </div>
          )}
          <p className="text-foreground-muted text-[11px]">
            Semua bot terdaftar di akun Anda
          </p>
        </div>

        {/* Webhook Delivery Success */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Kesehatan Webhook
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-wise-green/15 text-dark-green dark:text-wise-green">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <div>
              <p className="font-mono text-2xl font-black text-foreground">
                {stats.webhook_success_rate}%
              </p>
            </div>
          )}
          <p className="text-foreground-muted text-[11px]">
            Tingkat keberhasilan callback
          </p>
        </div>

        {/* Dispatch Latency */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Rata-rata Latensi
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <div>
              <p className="font-mono text-2xl font-black text-foreground">
                ~{stats.avg_latency_ms} ms
              </p>
            </div>
          )}
          <p className="text-foreground-muted text-[11px]">
            Kecepatan dispatch ke Telegram Server
          </p>
        </div>

        {/* Daily Quota Card */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Kuota Harian Terpakai
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <Activity className="size-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <div>
              <p className="font-mono text-2xl font-black text-foreground">
                {usagePercent}%
              </p>
            </div>
          )}
          <p className="text-foreground-muted text-[11px]">
            {stats.daily_sent_count.toLocaleString()} / {stats.daily_limit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Token-Bucket Rate Limiter Guard */}
      <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-wise-green/15 text-dark-green dark:text-wise-green">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h3 className="text-foreground text-sm font-bold">
              Proteksi Token-Bucket Rate Limiter
            </h3>
            <p className="text-foreground-secondary text-xs">
              Mencegah banned & error HTTP 429 dari Telegram
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3 space-y-1">
            <span className="text-foreground-secondary text-[11px] font-medium">
              Batas Global per Bot
            </span>
            <p className="font-mono font-bold text-wise-green text-sm flex items-center gap-1">
              <Zap className="size-3.5" />
              30 pesan / detik
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3 space-y-1">
            <span className="text-foreground-secondary text-[11px] font-medium">
              Batas Chat Pribadi
            </span>
            <p className="font-mono font-bold text-wise-green text-sm flex items-center gap-1">
              <Activity className="size-3.5" />
              1 pesan / detik
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelegramStatsCards;
