"use client";

import React from "react";
import { Send, CheckCheck, CheckCircle2, XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface TelegramLogStatsCardsProps {
  total: number;
  failedCount?: number;
  isLoading?: boolean;
}

export function TelegramLogStatsCards({
  total = 0,
  failedCount = 0,
  isLoading = false,
}: TelegramLogStatsCardsProps) {
  const { t } = useI18n();
  const successCount = Math.max(0, total - failedCount);
  const successRate =
    total > 0 ? ((successCount / total) * 100).toFixed(1) : "0.0";
  const failedRate =
    total > 0 ? Math.min(100, (failedCount / total) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* 1. Total Messages */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("telegram.logs.kpiTotalTitle")}
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : total.toLocaleString()}
            </h3>
          </div>
          <div className="flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
            <Send className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>

      {/* 2. Delivered Messages */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("telegram.logs.kpiDeliveredTitle")}
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : successCount.toLocaleString()}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground-secondary line-clamp-1 font-medium">
              {t("telegram.logs.kpiDeliveredSubtitle")}
            </p>
          </div>
          <div className="flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-purple-500/10 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400">
            <CheckCheck className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>

      {/* 3. Success Rate */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 w-full pr-1 sm:pr-2 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("telegram.logs.kpiSuccessRateTitle")}
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : `${successRate}%`}
            </h3>
            <div className="mt-1 sm:mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
          <div className="flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>

      {/* 4. Failed Messages */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 w-full pr-1 sm:pr-2 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("telegram.logs.kpiFailedTitle")}
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : failedCount.toLocaleString()}
            </h3>
            <div className="mt-1 sm:mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${failedRate}%` }}
              />
            </div>
          </div>
          <div className="flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
            <XCircle className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
