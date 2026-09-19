"use client";

import React from "react";
import { useTelegramStats, TelegramStatsTimeRange } from "../../hooks/useTelegramStats";
import { TelegramStatsCards } from "../../components/seller/TelegramStatsCards";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw } from "lucide-react";

const TIME_RANGES: {
  id: TelegramStatsTimeRange;
  labelKey: "rangeToday" | "range7d" | "range30d";
}[] = [
  { id: "today", labelKey: "rangeToday" },
  { id: "7d", labelKey: "range7d" },
  { id: "30d", labelKey: "range30d" },
];

export function TelegramStatsView() {
  const { t } = useI18n();
  const { stats, isLoading, timeRange, setTimeRange, reload } =
    useTelegramStats();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header with Title & Period Filter Switcher */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <BarChart3 className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              {t("telegram.stats.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("telegram.stats.subtitle")}
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
                  {t(`telegram.stats.${range.labelKey}`)}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => reload()}
            disabled={isLoading}
            className="border-border/80 text-xs font-semibold rounded-full h-8 px-3"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("telegram.stats.reload")}</span>
          </Button>
        </div>
      </div>

      {/* KPI & Quota Cards Component */}
      <TelegramStatsCards
        stats={stats}
        isLoading={isLoading}
        timeRange={timeRange}
      />
    </div>
  );
}

export default TelegramStatsView;
