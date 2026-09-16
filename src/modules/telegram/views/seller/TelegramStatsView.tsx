"use client";

import React from "react";
import { useTelegramStats } from "../../hooks/useTelegramStats";
import { TelegramStatsCards } from "../../components/seller/TelegramStatsCards";
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw } from "lucide-react";

export function TelegramStatsView() {
  const { stats, isLoading, reload } = useTelegramStats();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Statistik Telegram Bot
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Pantau performa transmisi bot Telegram, pemakaian kuota harian, dan kesehatan token-bucket rate limiter.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => reload()}
          disabled={isLoading}
          className="text-xs font-semibold"
        >
          <RefreshCw className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Muat Ulang</span>
        </Button>
      </div>

      {/* KPI & Quota Cards Component */}
      <TelegramStatsCards stats={stats} isLoading={isLoading} />
    </div>
  );
}

export default TelegramStatsView;
