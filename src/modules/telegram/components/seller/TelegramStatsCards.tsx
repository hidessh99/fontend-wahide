"use client";

import React from "react";
import {
  Bot,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { TelegramStats } from "../../types/telegram.types";

interface TelegramStatsCardsProps {
  stats: TelegramStats;
  isLoading?: boolean;
}

export function TelegramStatsCards({
  stats,
  isLoading = false,
}: TelegramStatsCardsProps) {
  const usagePercent = Math.min(
    100,
    Math.round(
      (stats.daily_sent_count / (stats.daily_limit || 100000)) * 100,
    ),
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
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

        {/* Daily Sent Messages */}
        <div className="bg-surface border-border rounded-2xl border p-5 space-y-3 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary text-xs font-semibold">
              Pesan Hari Ini
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div>
              <p className="font-mono text-2xl font-black text-foreground">
                {stats.daily_sent_count.toLocaleString()}
              </p>
            </div>
          )}
          <p className="text-foreground-muted text-[11px]">
            Total disitribusikan hari ini
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
      </div>

      {/* Quota Progress & Rate Limit Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Quota Card */}
        <div className="bg-surface border-border rounded-2xl border p-6 space-y-4 shadow-xs dark:bg-[#151614]">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-foreground text-sm font-bold">
                Pemakaian Kuota Harian Telegram
              </h3>
              <p className="text-foreground-secondary text-xs">
                Reset otomatis setiap pukul 00:00 WIB
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-foreground">
              {usagePercent}%
            </span>
          </div>

          <Progress value={usagePercent} className="h-2.5" />

          <div className="flex items-center justify-between text-xs text-foreground-muted font-mono">
            <span>
              Terpakai: {stats.daily_sent_count.toLocaleString()} pesan
            </span>
            <span>
              Batas: {stats.daily_limit.toLocaleString()} pesan/hari
            </span>
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

          <div className="grid grid-cols-2 gap-3 text-xs">
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
                <Activity className="size-3.5" />1 pesan / detik
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
