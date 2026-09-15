"use client";

import React from "react";
import { Send, CheckCheck, CheckCircle2, XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface MessageStatsProps {
  total: number;
  failedCount?: number;
  isLoading?: boolean;
}

export function MessageStatsCards({
  total = 0,
  failedCount = 0,
  isLoading = false,
}: MessageStatsProps) {
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
              {t("whatsapp.messagesTotal")}
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : total.toLocaleString()}
            </h3>
          </div>
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-700">
            <Send className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>

      {/* 2. Delivered Messages */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("whatsapp.messagesSentCount")}
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : successCount.toLocaleString()}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground-secondary line-clamp-1 font-medium">
              {t("whatsapp.messagesSentDesc")}
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
              {t("whatsapp.messagesSuccessRate")}
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {isLoading ? "..." : `${successRate}%`}
            </h3>
            <div className="mt-1 sm:mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-wise-green dark:bg-wise-green transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 sm:size-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-700">
            <CheckCircle2 className="size-3.5 sm:size-5" />
          </div>
        </div>
      </div>

      {/* 4. Failed Messages */}
      <div className="border-border bg-surface relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all hover:border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 w-full pr-1 sm:pr-2 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-bold text-foreground-secondary uppercase tracking-wider leading-tight line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("whatsapp.messagesFailed")}
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
